import { z } from "zod";

export const onboardingSchema = z.object({
  major: z
    .string({
      required_error: "Jurusan wajib diisi",
      invalid_type_error: "Jurusan harus berupa teks",
    })
    .min(2, "Nama jurusan terlalu pendek"),
  subjects: z.string().array().nonempty("Daftar mata kuliah tidak boleh kosong"),
  learningStyle: z.enum(["Visual", "Teks", "Step-by-step"], {
    errorMap: () => ({ message: "Gaya belajar tidak valid" }),
  }),
  goal: z.string().array().optional().default([]),
});
