const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const crypto = require("crypto");
const path = require("path");
const https = require("https");
const http = require("http");
const { URL } = require("url");

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Determine Cloudinary resource type for a file
 * @param {string} [mimeType]
 * @param {string} [filename]
 * @returns {"raw"|"image"}
 */
const getResourceType = (mimeType, filename) => {
  if (mimeType === "application/pdf") {
    return "raw";
  }
  if (filename && filename.toLowerCase().endsWith(".pdf")) {
    return "raw";
  }
  return "image";
};

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file data buffer
 * @param {Object|string} [optionsOrKey] - Upload options or public_id key
 * @param {string} [mimeTypeArg] - Content type
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadFileToCloudinary = (fileBuffer, optionsOrKey = {}, mimeTypeArg) => {
  return new Promise((resolve, reject) => {
    let options = {};
    if (typeof optionsOrKey === "string") {
      options.publicId = optionsOrKey;
      options.mimeType = mimeTypeArg;
    } else if (optionsOrKey && typeof optionsOrKey === "object") {
      options = { ...optionsOrKey };
      if (mimeTypeArg && !options.mimeType) {
        options.mimeType = mimeTypeArg;
      }
    }

    const mimeType =
      options.mimeType || options.fileType || "application/octet-stream";
    const originalName = options.originalName || options.name || "";
    const fileExt = originalName
      ? path.extname(originalName).toLowerCase()
      : mimeType === "application/pdf"
      ? ".pdf"
      : "";

    const resourceType =
      options.resourceType || getResourceType(mimeType, originalName);

    const uniqueId = crypto.randomUUID();
    let publicId = options.publicId;
    if (!publicId) {
      publicId =
        resourceType === "raw"
          ? uniqueId + (fileExt || ".pdf")
          : uniqueId;
    }

    const deliveryType = options.type || "authenticated";

    const uploadOptions = {
      folder: "clouddrive",
      public_id: publicId,
      resource_type: resourceType,
      type: deliveryType,
      overwrite: true,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Parse a Cloudinary URL to extract resourceType, deliveryType, and publicId
 * @param {string} urlStr
 * @returns {{ resourceType: string, deliveryType: string, publicId: string } | null}
 */
const parseCloudinaryUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 4) {
      const resourceType = parts[1];
      const deliveryType = parts[2];
      let startIndex = 3;
      if (parts[startIndex] && /^s--[a-zA-Z0-9_-]+--$/.test(parts[startIndex])) {
        startIndex++;
      }
      if (parts[startIndex] && /^v\d+$/.test(parts[startIndex])) {
        startIndex++;
      }
      const publicId = decodeURIComponent(parts.slice(startIndex).join("/"));
      return { resourceType, deliveryType, publicId };
    }
  } catch (e) {
    // Not a valid URL
  }
  return null;
};

/**
 * Get a readable file stream from Cloudinary using authenticated private_download_url
 * @param {Object|string} fileOrUrl - File document or Cloudinary URL
 * @returns {Promise<Readable>} Readable stream
 */
const getFileStreamFromCloudinary = (fileOrUrl) => {
  return new Promise((resolve, reject) => {
    let targetUrl = null;
    let publicId = null;
    let resourceType = null;
    let deliveryType = null;
    let fallbackUrl = null;

    if (typeof fileOrUrl === "string") {
      if (
        fileOrUrl.startsWith("http://") ||
        fileOrUrl.startsWith("https://")
      ) {
        fallbackUrl = fileOrUrl;
        const parsed = parseCloudinaryUrl(fileOrUrl);
        if (parsed) {
          publicId = parsed.publicId;
          resourceType = parsed.resourceType;
          deliveryType = parsed.deliveryType;
        }
      } else {
        publicId = fileOrUrl;
        resourceType = getResourceType(undefined, fileOrUrl);
      }
    } else if (fileOrUrl && typeof fileOrUrl === "object") {
      publicId = fileOrUrl.cloudinaryPublicId || fileOrUrl.public_id;
      resourceType =
        fileOrUrl.cloudinaryResourceType ||
        fileOrUrl.resource_type;
      deliveryType =
        fileOrUrl.cloudinaryType ||
        fileOrUrl.type;

      if (!resourceType) {
        resourceType = getResourceType(
          fileOrUrl.fileType,
          fileOrUrl.originalName || fileOrUrl.fileName
        );
      }

      if (fileOrUrl.cloudinaryUrl) {
        fallbackUrl = fileOrUrl.cloudinaryUrl;
      }

      if (!publicId && typeof fileOrUrl.filePath === "string") {
        if (
          fileOrUrl.filePath.startsWith("http://") ||
          fileOrUrl.filePath.startsWith("https://")
        ) {
          fallbackUrl = fallbackUrl || fileOrUrl.filePath;
          const parsed = parseCloudinaryUrl(fileOrUrl.filePath);
          if (parsed) {
            publicId = parsed.publicId;
            resourceType = resourceType || parsed.resourceType;
            deliveryType = deliveryType || parsed.deliveryType;
          }
        } else {
          publicId = fileOrUrl.filePath;
        }
      }
    }

    let finalDeliveryType = deliveryType;
    if (!finalDeliveryType) {
      if (fallbackUrl) {
        if (
          fallbackUrl.includes("/image/upload/") ||
          fallbackUrl.includes("/raw/upload/")
        ) {
          finalDeliveryType = "upload";
        } else if (
          fallbackUrl.includes("/image/authenticated/") ||
          fallbackUrl.includes("/raw/authenticated/")
        ) {
          finalDeliveryType = "authenticated";
        } else if (
          fallbackUrl.includes("/image/private/") ||
          fallbackUrl.includes("/raw/private/")
        ) {
          finalDeliveryType = "private";
        }
      }
    }
    if (!finalDeliveryType) {
      finalDeliveryType = "authenticated";
    }

    // Generate authenticated signed API download URL
    if (publicId) {
      try {
        const finalResourceType =
          resourceType ||
          (publicId.toLowerCase().endsWith(".pdf") ? "raw" : "image");

        const ext = path.extname(publicId).replace(/^\./, "");
        const formatArg = finalResourceType === "raw" ? "" : (ext || "");

        targetUrl = cloudinary.utils.private_download_url(publicId, formatArg, {
          resource_type: finalResourceType,
          type: finalDeliveryType,
        });
      } catch (signErr) {
        console.warn(
          "Could not generate authenticated download URL:",
          signErr.message
        );
        targetUrl = fallbackUrl;
      }
    } else {
      targetUrl = fallbackUrl;
    }

    if (!targetUrl) {
      const err = new Error("No Cloudinary asset URL or public_id available");
      err.statusCode = 404;
      return reject(err);
    }

    const fetchStream = (urlStr, redirectCount = 0) => {
      if (redirectCount > 5) {
        return reject(
          new Error("Too many redirects when fetching Cloudinary asset")
        );
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(urlStr);
      } catch (e) {
        return reject(e);
      }

      const client = parsedUrl.protocol === "http:" ? http : https;

      client
        .get(urlStr, (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            const nextUrl = new URL(res.headers.location, urlStr).toString();
            return fetchStream(nextUrl, redirectCount + 1);
          }

          // Automatic fallback for legacy assets uploaded as type: "upload"
          if (
            (res.statusCode === 404 || res.statusCode === 401) &&
            finalDeliveryType === "authenticated" &&
            publicId
          ) {
            try {
              const fallbackResourceType =
                resourceType ||
                (publicId.toLowerCase().endsWith(".pdf") ? "raw" : "image");
              const ext = path.extname(publicId).replace(/^\./, "");
              const formatArg =
                fallbackResourceType === "raw" ? "" : (ext || "");
              const legacyUrl = cloudinary.utils.private_download_url(
                publicId,
                formatArg,
                {
                  resource_type: fallbackResourceType,
                  type: "upload",
                }
              );
              finalDeliveryType = "upload";
              return fetchStream(legacyUrl, redirectCount + 1);
            } catch (fallbackErr) {
              // Continue to standard error handling below
            }
          }

          if (res.statusCode === 404) {
            const err = new Error("Physical file not found in Cloudinary.");
            err.statusCode = 404;
            return reject(err);
          }

          if (res.statusCode >= 400) {
            const err = new Error(
              "Cloudinary delivery error HTTP " + res.statusCode
            );
            err.statusCode = res.statusCode;
            return reject(err);
          }

          resolve(res);
        })
        .on("error", (err) => {
          reject(err);
        });
    };

    fetchStream(targetUrl);
  });
};

/**
 * Delete an asset from Cloudinary
 * @param {string|Object} publicIdOrFile - Public ID, Cloudinary URL, or File document
 * @param {string} [resourceType] - "image" or "raw"
 * @returns {Promise<Object>} Cloudinary destroy result ({ result: "ok" })
 */
const deleteFileFromCloudinary = async (publicIdOrFile, resourceType, typeArg) => {
  let publicId;
  let resType = resourceType;
  let deliveryType = typeArg;

  if (typeof publicIdOrFile === "string") {
    if (
      publicIdOrFile.startsWith("http://") ||
      publicIdOrFile.startsWith("https://")
    ) {
      const parsed = parseCloudinaryUrl(publicIdOrFile);
      if (parsed) {
        publicId = parsed.publicId;
        resType = resType || parsed.resourceType;
        deliveryType = deliveryType || parsed.deliveryType;
      } else {
        publicId = publicIdOrFile;
      }
    } else {
      publicId = publicIdOrFile;
    }
  } else if (publicIdOrFile && typeof publicIdOrFile === "object") {
    publicId =
      publicIdOrFile.cloudinaryPublicId ||
      publicIdOrFile.publicId;
    deliveryType =
      deliveryType ||
      publicIdOrFile.cloudinaryType ||
      publicIdOrFile.type;

    if (!publicId && typeof publicIdOrFile.filePath === "string") {
      if (
        publicIdOrFile.filePath.startsWith("http://") ||
        publicIdOrFile.filePath.startsWith("https://")
      ) {
        const parsed = parseCloudinaryUrl(publicIdOrFile.filePath);
        if (parsed) {
          publicId = parsed.publicId;
          resType = resType || parsed.resourceType;
          deliveryType = deliveryType || parsed.deliveryType;
        }
      } else {
        publicId = publicIdOrFile.filePath;
      }
    }

    if (!resType) {
      resType =
        publicIdOrFile.cloudinaryResourceType ||
        publicIdOrFile.resourceType ||
        getResourceType(
          publicIdOrFile.fileType,
          publicIdOrFile.originalName || publicIdOrFile.fileName
        );
    }
  }

  if (!publicId) {
    throw new Error("No public_id provided for Cloudinary deletion");
  }

  // Determine final resource_type: raw or image
  let finalResourceType = "image";
  if (resType === "raw" || resType === "image") {
    finalResourceType = resType;
  } else if (
    (typeof publicId === "string" && publicId.toLowerCase().endsWith(".pdf")) ||
    (publicIdOrFile && typeof publicIdOrFile === "object" && (
      publicIdOrFile.fileType === "application/pdf" ||
      (publicIdOrFile.originalName && publicIdOrFile.originalName.toLowerCase().endsWith(".pdf")) ||
      (publicIdOrFile.fileName && publicIdOrFile.fileName.toLowerCase().endsWith(".pdf"))
    ))
  ) {
    finalResourceType = "raw";
  } else {
    finalResourceType = "image";
  }

  if (!deliveryType) {
    if (publicIdOrFile && typeof publicIdOrFile === "object") {
      if (
        (publicIdOrFile.filePath && publicIdOrFile.filePath.includes("/upload/")) ||
        (publicIdOrFile.cloudinaryUrl && publicIdOrFile.cloudinaryUrl.includes("/upload/"))
      ) {
        deliveryType = "upload";
      }
    }
  }
  if (!deliveryType) {
    deliveryType = "authenticated";
  }

  const options = {
    resource_type: finalResourceType,
    type: deliveryType,
  };

  let result = await cloudinary.uploader.destroy(publicId, options);

  // Fallback to type: "upload" if authenticated returns not found (for legacy files)
  if ((!result || result.result !== "ok") && deliveryType === "authenticated") {
    try {
      const fallbackResult = await cloudinary.uploader.destroy(publicId, {
        resource_type: finalResourceType,
        type: "upload",
      });
      if (fallbackResult && fallbackResult.result === "ok") {
        result = fallbackResult;
      }
    } catch (fbErr) {
      // Ignore fallback error and preserve initial result
    }
  }

  if (!result || result.result !== "ok") {
    const errorMsg =
      result && result.result
        ? "Cloudinary deletion failed: " + result.result
        : "Cloudinary deletion failed";
    const error = new Error(errorMsg);
    error.cloudinaryResult = result;
    throw error;
  }

  return result;
};

module.exports = {
  cloudinary,
  uploadFileToCloudinary,
  getFileStreamFromCloudinary,
  deleteFileFromCloudinary,
  getResourceType,
  parseCloudinaryUrl,
};
