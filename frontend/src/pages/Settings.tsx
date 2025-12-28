import { useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/ui/GradientButton";
import { useUser } from "@/contexts/UserContext";
import { gayaBelajarOptions } from "@/data/mockData";
import { Camera, Eye, FileText, ListOrdered, Loader2, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/utils/api";

const iconMap = { Eye, FileText, ListOrdered };

export default function Settings() {
  const { user, updateUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || ""); // Email biasanya tidak diubah
  const [gayaBelajar, setGayaBelajar] = useState(user?.learningStyle || "step-by-step");
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("learningStyle", gayaBelajar);

      if (selectedFile) {
        formData.append("profilePircture", selectedFile);
      }

      const response = await api.patch("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Pengaturan berhasil disimpan!");
      }
    } catch (error: any) {
      error;
      toast.error(error.response?.data?.message || "Gagal menyimpan pengaturan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto Profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-24 w-24 rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground text-center">
                Klik foto untuk mengganti profil. <br /> Maksimal 2MB (JPG/PNG).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gaya Belajar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gayaBelajarOptions.map((opt) => {
                const Icon = iconMap[opt.icon as keyof typeof iconMap];
                return (
                  <div
                    key={opt.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      gayaBelajar === opt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setGayaBelajar(opt.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          gayaBelajar === opt.id ? "gradient-primary" : "bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            gayaBelajar === opt.id
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">{opt.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <GradientButton className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Pengaturan"
            )}
          </GradientButton>
        </div>
      </div>
    </Layout>
  );
}
