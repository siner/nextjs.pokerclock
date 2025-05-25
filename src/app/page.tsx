import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CircleAlertIcon,
  PlusIcon,
  SettingsIcon,
  PlayIcon,
  HistoryIcon,
  TrophyIcon,
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              <SparklesIcon className="mr-2 size-4" />
              Gestión Profesional de Torneos
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-8xl">
              Poker Clock
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl">
              La herramienta definitiva para organizar y gestionar torneos de
              poker profesionales. Cronómetro avanzado, gestión de plantillas y
              seguimiento completo.
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {/* Crear Plantilla */}
          <Card className="group flex flex-col border-0 bg-gradient-to-br from-green-50 to-emerald-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:from-green-950 dark:to-emerald-900">
            <CardHeader className="flex-1 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 transition-transform group-hover:scale-110 dark:bg-green-900">
                <PlusIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-green-800 dark:text-green-200">
                Crear Plantilla
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Diseña estructuras de torneo personalizadas con niveles, premios
                y configuraciones avanzadas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <Link
                  href="/gametemplates/create"
                  className="flex items-center justify-center gap-2"
                >
                  Crear Nueva
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Gestionar Plantillas */}
          <Card className="group flex flex-col border-0 bg-gradient-to-br from-blue-50 to-cyan-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:from-blue-950 dark:to-cyan-900">
            <CardHeader className="flex-1 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 transition-transform group-hover:scale-110 dark:bg-blue-900">
                <SettingsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Gestionar Plantillas
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Administra, edita y organiza todas tus plantillas de torneo en
                un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300"
              >
                <Link
                  href="/gametemplates"
                  className="flex items-center justify-center gap-2"
                >
                  Ver Plantillas
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Empezar Partida */}
          <Card className="group flex flex-col border-0 bg-gradient-to-br from-purple-50 to-pink-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:from-purple-950 dark:to-pink-900">
            <CardHeader className="flex-1 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 transition-transform group-hover:scale-110 dark:bg-purple-900">
                <PlayIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-purple-800 dark:text-purple-200">
                Empezar Partida
              </CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-400">
                Inicia un torneo con cronómetro profesional, gestión de
                jugadores y seguimiento en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
              >
                <Link
                  href="/play"
                  className="flex items-center justify-center gap-2"
                >
                  Iniciar Torneo
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Ver Historial */}
          <Card className="group flex flex-col border-0 bg-gradient-to-br from-amber-50 to-orange-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:from-amber-950 dark:to-orange-900">
            <CardHeader className="flex-1 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 transition-transform group-hover:scale-110 dark:bg-amber-900">
                <HistoryIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-amber-800 dark:text-amber-200">
                Ver Historial
              </CardTitle>
              <CardDescription className="text-amber-600 dark:text-amber-400">
                Consulta estadísticas, resultados y análisis detallados de todos
                tus torneos anteriores
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
              >
                <Link
                  href="/history"
                  className="flex items-center justify-center gap-2"
                >
                  Ver Historial
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-slate-800 dark:text-slate-200 sm:mb-8 sm:text-3xl">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Cronómetro Profesional
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Control preciso de niveles con notificaciones sonoras y visuales
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <TrophyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Gestión de Premios
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cálculo automático de premios y estructuras dinámicas
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <UsersIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Control de Jugadores
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Seguimiento de entradas, add-ons y estadísticas en tiempo real
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                <DollarSignIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Cálculo de Botes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gestión automática de comisiones, add-ons y botes extra
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-16 border-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-slate-800 dark:text-slate-200 sm:text-2xl">
              Guía Rápida
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Sigue estos pasos para organizar tu primer torneo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                  Crear Plantilla
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Define la estructura de tu torneo: niveles, premios y
                  configuraciones
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                  Iniciar Partida
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Selecciona tu plantilla y comienza el torneo con el cronómetro
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                  Gestionar Torneo
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Controla jugadores, niveles y finaliza para guardar en el
                  historial
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Section */}
        <div className="mx-auto max-w-2xl">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CircleAlertIcon className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">
              Información Importante
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Toda la información se guarda en el almacenamiento local de tu
              navegador. Los datos no se envían a ningún servidor, garantizando
              tu privacidad. Recuerda hacer copias de seguridad exportando tus
              plantillas e historial.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </main>
  );
}
