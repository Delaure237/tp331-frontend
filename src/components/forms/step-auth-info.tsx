'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { IAuthInfoForm } from '@/types/forms';

const defaultInitialData: IAuthInfoForm = {
    adminRole: 'Administrator',
    adminEmail: '',
    password: '',
    confirmPassword: '',
};


interface StepProps {
    initialData: IAuthInfoForm;
    onSubmit: (data: Omit<IAuthInfoForm, 'confirmPassword'>) => void;
    goToPreviousStep: () => void;
}

const StepAuthInfo: React.FC<StepProps> = ({ initialData, onSubmit, goToPreviousStep }) => {

    // 🎯 CORRECTION : Typage du state avec IAuthInfoForm
    const [data, setData] = useState<IAuthInfoForm>({
        adminRole: initialData.adminRole || defaultInitialData.adminRole,
        adminEmail: initialData.adminEmail || defaultInitialData.adminEmail,
        password: initialData.password || defaultInitialData.password,
        confirmPassword: initialData.confirmPassword || defaultInitialData.confirmPassword,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        // La validation d'ID est implicite grâce au typage
        setData((prev: IAuthInfoForm) => ({ ...prev, [id]: value }));
    };


    const handleSelectChange = (value: string) => {
        const adminRole = value as IAuthInfoForm['adminRole'];
        setData((prev: IAuthInfoForm) => ({ ...prev, adminRole }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation basique (à remplacer par Zod)
        if (data.password !== data.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!data.adminEmail || !data.password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // On soumet uniquement les données d'auth + le rôle
        // Omit<IAuthInfoForm, 'confirmPassword'> est utilisé dans StepProps pour typer la sortie
        const { confirmPassword, ...submitData } = data;
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>

                {/* 1. Champ Rôle */}
                <Field>
                    <FieldLabel htmlFor="adminRole">Rôle</FieldLabel>
                    <Select required name="adminRole" value={data.adminRole} onValueChange={handleSelectChange}>
                        <SelectTrigger id="adminRole">
                            <SelectValue placeholder="Sélectionnez votre rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Administrator">Administrateur</SelectItem>
                            <SelectItem value="Doctor">Docteur</SelectItem>
                            <SelectItem value="Cashier">Caissier</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                {/* 2. Email de l'Administrateur */}
                <Field>
                    {/* 🎯 CORRECTION : Remplacement de l'apostrophe dans le label */}
                    <FieldLabel htmlFor="adminEmail">Email de l&apos;Administrateur</FieldLabel>
                    <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@hospicare.com"
                        required
                        value={data.adminEmail}
                        onChange={handleChange}
                    />
                    <FieldDescription>Cet email servira pour la connexion.</FieldDescription>
                </Field>

                {/* 3. Mot de Passe */}
                <Field>
                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={data.password}
                        onChange={handleChange}
                    />
                    <FieldDescription>Doit contenir au moins 8 caractères.</FieldDescription>
                </Field>

                {/* 4. Confirmation du Mot de Passe */}
                <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirmer le Mot de passe</FieldLabel>
                    <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={data.confirmPassword}
                        onChange={handleChange}
                    />
                </Field>

                {/* Boutons de navigation */}
                <div className="flex justify-between w-full pt-4">
                    <Button
                        type="button"
                        onClick={goToPreviousStep}
                        variant="outline"
                    >
                        <ChevronLeft size={16} className="mr-2" /> Retour
                    </Button>
                    <Button
                        type="submit"
                    >
                        Créer le Compte
                    </Button>
                </div>

                <div className="text-center pt-4">
                    <FieldDescription className="text-center text-sm">
                        Déjà un compte ? <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">Connectez-vous</a>
                    </FieldDescription>
                </div>
            </FieldGroup>
        </form>
    );
};

export default StepAuthInfo;