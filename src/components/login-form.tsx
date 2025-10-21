// src/components/login-form.tsx

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EyeOff, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  // 🎯 CORRECTION: Ré-import de FieldDescription
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="p-6 pb-2">

          <div className="flex justify-center mb-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span
                className={cn(
                  "bg-clip-text text-transparent",
                  "bg-gradient-to-r from-green-700 to-blue-400"
                )}
              >
                HospiCare
              </span>
            </h1>
          </div>

          <CardDescription className="text-center">
            Connectez-vous à votre compte pour continuer.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              console.log("Formulaire soumis")
            }}
            autoComplete="off"
          >
            <FieldGroup>



              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@hospicare.com"
                  required
                  autoComplete="off"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>

                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pr-10"
                    placeholder="Entrez votre mot de passe"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </Field>

                         <Field>
                <FieldLabel htmlFor="role">Rôle</FieldLabel>
                <Select required name="role">
                  <SelectTrigger id="role" className="h-10">
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrateur</SelectItem>
                    <SelectItem value="Doctor">Docteur</SelectItem>
                    <SelectItem value="Cashier">Caissier</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="space-y-3 pt-2">

                <Button type="submit" className="w-full bg-[#058D66] hover:bg-[#058D66]/90">
                  Se connecter
                </Button>

                <FieldDescription className="text-center text-sm">
                  Vous n&apos;avez pas de compte ?

                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Inscrivez-vous
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}