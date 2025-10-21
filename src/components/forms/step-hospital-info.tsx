/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { XCircle, GalleryVerticalEnd, ImageIcon, ChevronDown } from 'lucide-react';
import { HOSPITAL_SPECIALTIES, IHospitalInfoForm, HospitalInfoSchema } from '@/types/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";

// État initial mis à jour
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

interface StepProps {
    initialData: Partial<IHospitalInfoForm>;
    onSubmit: (data: IHospitalInfoForm) => void;
}

const StepHospitalInfo: React.FC<StepProps> = ({ initialData, onSubmit }) => {

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
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false); // État du popover

    const logoInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    // Prévisualisations
    useEffect(() => {
        if (data.hospitalLogo && data.hospitalLogo.length > 0) {
            const file = data.hospitalLogo[0];
            const url = URL.createObjectURL(file);
            setLogoPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setLogoPreview(null);
        }
    }, [data.hospitalLogo]);

    useEffect(() => {
        if (data.hospitalImages) {
            const urls = Array.from(data.hospitalImages).map(file => URL.createObjectURL(file));
            setImagesPreview(urls);
            return () => urls.forEach(URL.revokeObjectURL);
        } else {
            setImagesPreview([]);
        }
    }, [data.hospitalImages]);


    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target;
        if (id in data) {
            const newValue = files || value;
            setData(prev => ({ ...prev, [id]: newValue }));
            setErrors(prev => prev.filter(err => err.path[0] !== id));
        }
    };

    const handleServiceToggle = (specialty: string, checked: boolean) => {
        let updatedServices = checked
            ? [...data.services, specialty]
            : data.services.filter(s => s !== specialty);

        setData(prev => ({ ...prev, services: updatedServices }));
        setErrors(prev => prev.filter(err => err.path[0] !== 'services'));
    };

    const clearFile = useCallback((fieldName: 'hospitalLogo' | 'hospitalImages', inputRef: React.RefObject<HTMLInputElement>) => {
        setData(prev => ({ ...prev, [fieldName]: null }));
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, []);

    const getError = (fieldName: keyof IHospitalInfoForm) => {
        const error = errors.find(err => err.path[0] === fieldName);
        return error ? error.message : null;
    }

    // Affichage des services sélectionnés
    const displaySelectedServices = () => {
        if (data.services.length === 0) return "Sélectionnez les services...";
        if (data.services.length === 1) return data.services[0];

        // Affichage abrégé pour plus d'un
        return `${data.services[0]}, (+${data.services.length - 1} autres)`;
    };


    // Soumission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = HospitalInfoSchema.safeParse(data);

        if (!result.success) {
            setErrors(result.error.issues);
            return;
        }

        setErrors([]);
        onSubmit(result.data as IHospitalInfoForm);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>

                {/* 1. Nom de l'Hôpital & Email */}
                <Field>
                    <FieldLabel htmlFor="hospitalName">Nom de l'Hôpital</FieldLabel>
                    <Input
                        id="hospitalName"
                        type="text"
                        placeholder="HospiCare Central"
                        required
                        value={data.hospitalName}
                        onChange={handleChange}
                    />
                    {getError('hospitalName') && <p className="text-red-500 text-sm mt-1">{getError('hospitalName')}</p>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="hospitalEmail">Email de Contact</FieldLabel>
                    <Input
                        id="hospitalEmail"
                        type="email"
                        placeholder="contact@hospicare.com"
                        required
                        value={data.hospitalEmail}
                        onChange={handleChange}
                    />
                    {getError('hospitalEmail') && <p className="text-red-500 text-sm mt-1">{getError('hospitalEmail')}</p>}
                </Field>

                {/* 2. Numéros de Téléphone (Ligne double) */}
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="phoneNumber1">Téléphone 1 (Principal)</FieldLabel>
                        <Input
                            id="phoneNumber1"
                            type="tel"
                            placeholder="+237 6xx-xx-xx-xx"
                            required
                            value={data.phoneNumber1}
                            onChange={handleChange}
                        />
                        {getError('phoneNumber1') && <p className="text-red-500 text-sm mt-1">{getError('phoneNumber1')}</p>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="phoneNumber2">Téléphone 2 (Optionnel)</FieldLabel>
                        <Input
                            id="phoneNumber2"
                            type="tel"
                            placeholder="+237 6xx-xx-xx-xx"
                            value={data.phoneNumber2}
                            onChange={handleChange}
                        />
                        {getError('phoneNumber2') && <p className="text-red-500 text-sm mt-1">{getError('phoneNumber2')}</p>}
                    </Field>
                </div>

                {/* 3. Adresse */}
                <Field>
                    <FieldLabel htmlFor="address">Adresse Complète</FieldLabel>
                    <Input
                        id="address"
                        type="text"
                        placeholder="Ex: 123 Rue de la Liberté, Quartier Central"
                        required
                        value={data.address}
                        onChange={handleChange}
                    />
                    {getError('address') && <p className="text-red-500 text-sm mt-1">{getError('address')}</p>}
                </Field>

                {/* 4. Services et Heures d'Ouverture (Ligne double) */}
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="openingHours">Heures d'Ouverture</FieldLabel>
                        <Input
                            id="openingHours"
                            type="text"
                            placeholder="Ex: 8h00 - 18h00"
                            required
                            value={data.openingHours}
                            onChange={handleChange}
                        />
                        {getError('openingHours') && <p className="text-red-500 text-sm mt-1">{getError('openingHours')}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="services">Services/Spécialités</FieldLabel>
                        {/* Multi-Select personnalisé utilisant Popover */}
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isPopoverOpen}
                                    className="w-full justify-between h-10"
                                >
                                    {displaySelectedServices()}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <div className="max-h-60 overflow-y-auto">
                                    {HOSPITAL_SPECIALTIES.map((specialty) => (
                                        <div key={specialty} className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer">
                                            <Checkbox
                                                id={specialty}
                                                // 🎯 Utilisation des classes personnalisées pour le bleu
                                                className="h-4 w-4 rounded border-gray-400 checked:bg-green-600 checked:border-green-600 focus-visible:ring-green-600"
                                                checked={data.services.includes(specialty)}
                                                onCheckedChange={(checked) => handleServiceToggle(specialty, checked as boolean)}
                                            />
                                            <Label htmlFor={specialty} className="text-sm font-medium leading-none cursor-pointer">
                                                {specialty}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                        {getError('services') && <p className="text-red-500 text-sm mt-1">{getError('services')}</p>}
                    </Field>
                </div>

                {/* 5 & 6. Uploads (Ligne double 30/70) */}
                <div className="flex gap-4">
                    {/* Logo (30%) */}
                    <div className="space-y-2 w-[30%]">
                        <Label htmlFor="hospitalLogo">Logo (Optionnel)</Label>
                        <div
                            className={cn(
                                `flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`,
                                // 🎯 Bordure plus épaisse
                                `border-gray-400`
                            )}
                            onClick={() => logoInputRef.current?.click()}
                        >
                            {logoPreview ? (
                                <div className="relative group w-full h-32 flex items-center justify-center">
                                    <img src={logoPreview} alt="Logo Preview" className="rounded-md max-h-full max-w-full object-contain" />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onClick={(e) => { e.stopPropagation(); clearFile('hospitalLogo', logoInputRef); }}
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <GalleryVerticalEnd className="w-10 h-10 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600"><span className="font-semibold">Téléverser</span></p>
                                    <p className="text-xs text-gray-500">PNG, JPG (Max 10MB)</p>
                                </>
                            )}
                            <input id="hospitalLogo" type="file" accept="image/*" className="hidden" onChange={handleChange} ref={logoInputRef} />
                        </div>
                        {getError('hospitalLogo') && <p className="text-red-500 text-sm mt-1">{getError('hospitalLogo')}</p>}
                    </div>

                    {/* Images de la Façade (70%) */}
                    <div className="space-y-2 flex-1 w-[70%]">
                        <Label htmlFor="hospitalImages">Photos de la Façade (Optionnel, Max 3)</Label>
                        <div
                             className={cn(
                                `flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`,
                                `border-gray-400 h-full min-h-[170px]`
                            )}
                            onClick={() => imagesInputRef.current?.click()}
                        >
                            {imagesPreview.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4 w-full">
                                    {imagesPreview.map((url, index) => (
                                        <div key={index} className="relative group aspect-square rounded-md overflow-hidden">
                                            <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                onClick={(e) => { e.stopPropagation(); /* La logique de suppression individuelle est complexe */ }}
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="ghost" className="col-span-3 text-red-500 hover:text-red-700"
                                        onClick={(e) => { e.stopPropagation(); clearFile('hospitalImages', imagesInputRef); }}>
                                        Effacer toutes les photos
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon className="w-10 h-10 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600"><span className="font-semibold">Cliquez pour téléverser</span> (Multiples)</p>
                                    <p className="text-xs text-gray-500">PNG, JPG (Max 10MB)</p>
                                </>
                            )}
                            <input id="hospitalImages" type="file" accept="image/*" multiple className="hidden" onChange={handleChange} ref={imagesInputRef} />
                        </div>
                        {getError('hospitalImages') && <p className="text-red-500 text-sm mt-1">{getError('hospitalImages')}</p>}
                    </div>
                </div>


                {/* Bouton de navigation */}
                <Button type="submit" className="w-full mt-6 bg-[#058D66] hover:bg-[#058D66]/90">
                    Étape suivante
                </Button>
            </FieldGroup>
        </form>
    );
};

export default StepHospitalInfo;