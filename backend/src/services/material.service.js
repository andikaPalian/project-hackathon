import { db } from "../config/firebase.js";
import { extractTextFromPdf } from "../helper/extractPdf.js";
import { uploadToCloudinary } from "../helper/uploadFile.js";
import { generateTopicsFromMaterial } from "./gemini.service.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const officeParser = require("officeparser");

export const createMaterial = async (userId, file, title, subject) => {
  try {
    // const fileName = `${userId}-${Date.now()}-${file.originalname.split(".")[0]}`;
    const fileName = `${userId}-${Date.now()}`;

    let textContent = "";

    if (file.mimetype === "application/pdf") {
      textContent = await extractTextFromPdf(file.buffer);
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      file.mimetype === "application/vnd.ms-powerpoint"
    ) {
      // Gunakan officeParser untuk PPT
      textContent = await new Promise((resolve, reject) => {
        officeParser.parseOffice(file.buffer, (data, err) => {
          if (err) reject(new Error("Gagal membaca file PPT: " + err));
          else resolve(data);
        });
      });
    } else {
      throw new Error("Format file tidak didukung. Harap upload PDF atau PPT.");
    }
    const topics = await generateTopicsFromMaterial(file.buffer, file.mimetype);

    const cloudinaryResult = await uploadToCloudinary(file.buffer, "hackathon_materials", fileName);

    const statusEnum = ["belum_dimulai", "sedang_belajar", "dikuasai"];

    const materialRecord = {
      uploadedBy: userId,
      title: title || file.originalname,
      subject: subject,
      summary: textContent.substring(0, 500),
      fullContent: textContent,
      fileUrl: cloudinaryResult.secure_url,
      filePublicId: cloudinaryResult.public_id,
      fileType: file.mimetype,
      status: statusEnum[0],
      topicCount: 0,
      topics: topics,
      createdAt: new Date(),
    };

    await db.collection("materials").add(materialRecord);

    return { success: true };
  } catch (error) {
    throw new Error("Failed to create material.");
  }
};

export const getMaterialByUser = async (userId) => {
  try {
    const snapshot = await db
      .collection("materials")
      .where("uploadedBy", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      return [];
    }

    const materials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return materials;
  } catch (error) {
    throw new Error("Failed to get material by user.");
  }
};

export const getMaterialById = async (materialId, userId) => {
  try {
    const materialDoc = await db.collection("materials").doc(materialId).get();
    if (!materialDoc.exists) {
      throw new Error("Material not found.");
    }

    const data = materialDoc.data();

    if (data.uploadedBy !== userId) {
      throw new Error("You are not authorized to access this material.");
    }

    return {
      id: materialDoc.id,
      ...data,
    };
  } catch (error) {
    throw new Error("Failed to get material by id.");
  }
};
