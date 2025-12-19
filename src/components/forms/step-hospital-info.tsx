/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ImageIcon, ChevronLeft } from 'lucide-react';
import { HOSPITAL_SPECIALTIES, IHospitalInfoForm, HospitalInfoSchema } from '@/types/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface StepProps {
    initialData: Partial<IHospitalInfoForm>;
    onSubmit: (data: IHospitalInfoForm) => void;
    onBack: () => void;
}

const defaultInitialData: IHospitalInfoForm = {
    hospitalName: '',
    hospitalEmail: '',
    phoneNumber1: '',
    phoneNumber2: '',
    address: '',
    openingHours: '',
    services: [],
    hospitalLogo: null,
    hospitalImages: null,
};

const StepHospitalInfo: React.FC<StepProps> = ({ initialData, onSubmit, onBack }) => {
    const [data, setData] = useState<IHospitalInfoForm>({
        hospitalName: initialData.hospitalName ?? defaultInitialData.hospitalName,
        hospitalEmail: initialData.hospitalEmail ?? defaultInitialData.hospitalEmail,
        phoneNumber1: initialData.phoneNumber1 ?? defaultInitialData.phoneNumber1,
        phoneNumber2: initialData.phoneNumber2 ?? defaultInitialData.phoneNumber2,
        address: initialData.address ?? defaultInitialData.address,
        openingHours: initialData.openingHours ?? defaultInitialData.openingHours,
        services: initialData.services ?? defaultInitialData.services,
        hospitalLogo: initialData.hospitalLogo ?? defaultInitialData.hospitalLogo,
        hospitalImages: initialData.hospitalImages ?? defaultInitialData.hospitalImages,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    // Prévisualisation du Logo
    useEffect(() => {
        if (data.hospitalLogo instanceof FileList && data.hospitalLogo.length > 0) {
            const url = URL.createObjectURL(data.hospitalLogo[0]);
            setLogoPreview(url);
            return () => URL.revokeObjectURL(url);
        } else if (data.hospitalLogo instanceof File) {
            const url = URL.createObjectURL(data.hospitalLogo);
            setLogoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setLogoPreview(null);
    }, [data.hospitalLogo]);

    // Prévisualisation des Images
    useEffect(() => {
        if (data.hospitalImages instanceof FileList) {
            const urls = Array.from(data.hospitalImages).map(file => URL.createObjectURL(file));
            setImagesPreview(urls);
            return () => urls.forEach(URL.revokeObjectURL);
        }
        setImagesPreview([]);
    }, [data.hospitalImages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { id, value, files } = target;
        const newValue = files && files.length > 0 ? files : value;

        setData(prev => ({ ...prev, [id]: newValue }));
        // Nettoyer l'erreur quand l'utilisateur tape
        if (formErrors[id]) {
            setFormErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[id];
                return newErrs;
            });
        }
    };

    const handleServiceToggle = (specialty: string, checked: boolean) => {
        const updatedServices = checked
            ? [...data.services, specialty]
            : data.services.filter(s => s !== specialty);
        setData(prev => ({ ...prev, services: updatedServices as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(" [DEBUG] Tentative de soumission avec les données :", data);

        const result = HospitalInfoSchema.safeParse(data);

        if (!result.success) {
            const errorsObj: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                const path = issue.path[0] as string;
                errorsObj[path] = issue.message;
            });

            console.error(" [DEBUG] Erreurs de validation Zod :", errorsObj);
            setFormErrors(errorsObj);
            return;
        }

        console.log(" [DEBUG] Validation réussie, appel de onSubmit");
        setFormErrors({});
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel className={formErrors.hospitalName ? "text-red-500" : ""}>Nom de l&apos;Hôpital</FieldLabel>
                        <Input id="hospitalName" value={data.hospitalName} onChange={handleChange} className={formErrors.hospitalName ? "border-red-500" : ""} />
                        {formErrors.hospitalName && <p className="text-xs text-red-500 mt-1">{formErrors.hospitalName}</p>}
                    </Field>
                    <Field>
                        <FieldLabel className={formErrors.hospitalEmail ? "text-red-500" : ""}>Email de Contact</FieldLabel>
                        <Input id="hospitalEmail" type="email" value={data.hospitalEmail} onChange={handleChange} className={formErrors.hospitalEmail ? "border-red-500" : ""} />
                        {formErrors.hospitalEmail && <p className="text-xs text-red-500 mt-1">{formErrors.hospitalEmail}</p>}
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel className={formErrors.phoneNumber1 ? "text-red-500" : ""}>Téléphone 1</FieldLabel>
                        <Input id="phoneNumber1" value={data.phoneNumber1} onChange={handleChange} className={formErrors.phoneNumber1 ? "border-red-500" : ""} />
                        {formErrors.phoneNumber1 && <p className="text-xs text-red-500 mt-1">{formErrors.phoneNumber1}</p>}
                    </Field>
                    <Field>
                        <FieldLabel>Téléphone 2</FieldLabel>
                        <Input id="phoneNumber2" value={data.phoneNumber2 || ''} onChange={handleChange} />
                    </Field>
                </div>

                <Field>
                    <FieldLabel className={formErrors.address ? "text-red-500" : ""}>Adresse Complète</FieldLabel>
                    <Input id="address" value={data.address} onChange={handleChange} className={formErrors.address ? "border-red-500" : ""} />
                    {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel className={formErrors.openingHours ? "text-red-500" : ""}>Heures d&apos;Ouverture</FieldLabel>
                        <Input id="openingHours" placeholder="Ex: 24h/24, 8h-18h" value={data.openingHours} onChange={handleChange} className={formErrors.openingHours ? "border-red-500" : ""} />
                        {formErrors.openingHours && <p className="text-xs text-red-500 mt-1">{formErrors.openingHours}</p>}
                    </Field>
                    <Field>
                        <FieldLabel className={formErrors.services ? "text-red-500" : ""}>Services</FieldLabel>
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={`w-full justify-between ${formErrors.services ? "border-red-500" : ""}`}>
                                    {data.services.length > 0 ? `${data.services.length} sélectionnés` : "Choisir..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-2 max-h-60 overflow-y-auto">
                                {HOSPITAL_SPECIALTIES.map((s) => (
                                    <div key={s} className="flex items-center space-x-2 p-1">
                                        <Checkbox id={s} checked={data.services.includes(s)} onCheckedChange={(c) => handleServiceToggle(s, c as boolean)} />
                                        <Label htmlFor={s} className="cursor-pointer">{s}</Label>
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>
                        {formErrors.services && <p className="text-xs text-red-500 mt-1">{formErrors.services}</p>}
                    </Field>
                </div>

                <div className="flex gap-4">
                    <div className="w-1/3">
                        <Label>Logo</Label>
                        <div className="border-2 border-dashed rounded-lg p-2 text-center bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => logoInputRef.current?.click()}>
                            {logoPreview ? <img src={logoPreview} className="h-20 mx-auto object-contain" alt="logo" /> : <ImageIcon className="mx-auto text-gray-400" />}
                            <input id="hospitalLogo" type="file" className="hidden" ref={logoInputRef} onChange={handleChange} accept="image/*" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <Label>Photos Façade</Label>
                        <div className="border-2 border-dashed rounded-lg p-2 bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => imagesInputRef.current?.click()}>
                            {imagesPreview.length > 0 ? (
                                <div className="flex gap-1 overflow-x-auto">
                                    {imagesPreview.map((url, i) => <img key={i} src={url} className="h-20 w-20 object-cover rounded" alt="façade" />)}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-4">Ajouter des photos...</div>
                            )}
                            <input id="hospitalImages" type="file" multiple className="hidden" ref={imagesInputRef} onChange={handleChange} accept="image/*" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Retour
                    </Button>
                    <Button type="submit" className="flex-1 bg-[#058D66] hover:bg-[#047a57] text-white font-bold">
                        Suivant
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
};

export default StepHospitalInfo;