"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EyeOff, Eye, Loader2, AlertCircle } from 'lucide-react'
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      // La redirection vers /dashboard est gérée par le contexte
    } catch (error: any) {
      // Gestion pragmatique de l'erreur 401 (Invalid credentials)
      if (error.response?.status === 401) {
        setErrorMessage("L'email ou le mot de passe est incorrect.")
      } else {
        setErrorMessage("Une erreur est survenue lors de la connexion.")
      }
      console.error("Erreur login:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("w-full max-w-[400px] mx-auto", className)} {...props}>
      <Card className="border-none shadow-2xl shadow-blue-900/10 bg-white">
        <CardHeader className="p-8 pb-4">
          <div className="flex justify-center mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-blue-500">
                HospiCare
              </span>
            </h1>
          </div>
          <CardDescription className="text-center text-gray-500">
            Connectez-vous à votre compte pour continuer.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ✅ BADGE D'ERREUR (S'affiche uniquement en cas de 401 ou erreur) */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-800 border border-red-200 rounded-lg bg-red-50 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@hospicare.com"
                  required
                  className="h-11 border-gray-200 focus-visible:ring-green-600"
                  disabled={isSubmitting}
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    Oublié ?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="h-11 pr-10 border-gray-200 focus-visible:ring-green-600"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Rôle</FieldLabel>
                <Select required name="role" disabled={isSubmitting}>
                  <SelectTrigger id="role" className="h-11 border-gray-200">
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrateur</SelectItem>
                    <SelectItem value="Doctor">Docteur</SelectItem>
                    <SelectItem value="Cashier">Caissier</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#058D66] hover:bg-[#047252] text-white font-bold transition-all shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Pas de compte ?{" "}
                <a href="/register" className="text-blue-600 font-semibold hover:underline">
                  Inscrivez-vous
                </a>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}