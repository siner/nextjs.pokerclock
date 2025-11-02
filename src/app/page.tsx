import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  ClipboardCheckIcon,
  Clock3Icon,
  DatabaseIcon,
  HistoryIcon,
  Layers3Icon,
  PlayIcon,
  ShieldIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";

const actions = [
  {
    title: "Crear Plantilla",
    description:
      "Diseña niveles, premios y reglas personalizadas en cuestión de minutos.",
    href: "/gametemplates/create",
    icon: SparklesIcon,
    cta: "Nueva plantilla",
  },
  {
    title: "Gestionar Plantillas",
    description: "Organiza tu biblioteca y carga estructuras predefinidas.",
    href: "/gametemplates",
    icon: Layers3Icon,
    cta: "Abrir panel",
  },
  {
    title: "Iniciar Partida",
    description:
      "Lanza el reloj y comparte la cuenta atrás con tu grupo en segundos.",
    href: "/play",
    icon: PlayIcon,
    cta: "Ir al reloj",
  },
  {
    title: "Historial & Stats",
    description:
      "Consulta resultados, exporta informes y comparte resúmenes con tu grupo.",
    href: "/history",
    icon: HistoryIcon,
    cta: "Revisar partidas",
  },
];

const features = [
  {
    title: "Cronómetro claro",
    description:
      "Cuenta atrás gigante, avisos sonoros y visuales perfectos para TV o proyector.",
    icon: Clock3Icon,
  },
  {
    title: "Gestión sencilla",
    description:
      "Añade jugadores, recompras y add-ons con botones grandes y accesibles.",
    icon: UsersIcon,
  },
  {
    title: "Premios automáticos",
    description:
      "Calcula el reparto en función del bote real y guarda tus configuraciones favoritas.",
    icon: TrophyIcon,
  },
  {
    title: "Datos locales",
    description:
      "Todo se queda en tu navegador. Exporta copias de seguridad cuando quieras.",
    icon: DatabaseIcon,
  },
  {
    title: "Temas a elección",
    description:
      "Escoge el ambiente que mejor encaje con tu partida: clásico, nocturno o tapete.",
    icon: ShieldIcon,
  },
  {
    title: "Listo sin internet",
    description:
      "Ideal para partidas en casa: funciona incluso si te quedas sin conexión.",
    icon: ClipboardCheckIcon,
  },
];

const quickSteps = [
  {
    step: "1",
    title: "Configura tu estructura",
    description:
      "Define niveles, premios y políticas de entradas desde una plantilla o desde cero.",
  },
  {
    step: "2",
    title: "Lanza el torneo",
    description:
      "Selecciona la plantilla, proyecta el reloj y controla el ritmo desde cualquier dispositivo local.",
  },
  {
    step: "3",
    title: "Guarda y analiza",
    description:
      "Exporta resultados, comparte resúmenes con tu grupo y prepara la siguiente edición.",
  },
];

const stats = [
  { label: "Usuarios en casa", value: "Miles" },
  { label: "Plantillas guardadas", value: "∞" },
  { label: "Modo offline", value: "Siempre" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-12 pb-12">
      <section className="bg-surface relative overflow-hidden rounded-3xl border border-border/60 shadow-[0_40px_120px_-70px_hsl(var(--shadow-strong))]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-bl-[200px] bg-[radial-gradient(120%_80%_at_80%_10%,hsl(var(--accent)_/_0.35),transparent_65%)] lg:block"
        />
        <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-6">
            <span className="bg-surface-muted w-fit rounded-full border border-border/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Reloj de poker
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              El reloj de poker perfecto para tus partidas entre amigos
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Diseña plantillas en minutos, proyecta el reloj en grande y
              controla entradas, recompras y premios sin complicaciones. Todo
              guardado en tu navegador para la próxima noche de poker.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="/play" className="flex items-center gap-2">
                  Ir al reloj
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/gametemplates">Gestionar plantillas</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-muted/80 rounded-xl border border-border/70 px-4 py-3 text-left shadow-[0_20px_40px_-38px_hsl(var(--shadow-soft))]"
                >
                  <span className="text-lg font-semibold text-foreground">
                    {stat.value}
                  </span>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-muted/60 flex flex-col justify-between gap-6 rounded-2xl border border-border/60 p-6 shadow-[0_30px_80px_-50px_hsl(var(--shadow-soft))]">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Pensado para clubes y ligas
              </h2>
              <p className="text-sm text-muted-foreground">
                • Modo TV con tipografía enorme y contraste alto.
                <br />• Botonera optimizada para pantallas táctiles.
                <br />• Guardado automático y recuperación ante errores.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border/60 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Mantén el control
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                Atajos rápidos y estados claros en cada fase del torneo
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pausa y reanuda con la barra espaciadora, ajusta niveles al
                vuelo y recibe avisos sonoros antes de cada subida de ciegas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <div
            key={action.title}
            className="bg-surface group flex flex-col justify-between rounded-2xl border border-border/60 p-6 shadow-[0_30px_80px_-65px_hsl(var(--shadow-soft))] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_40px_120px_-70px_hsl(var(--shadow-strong))]"
          >
            <div className="flex flex-1 flex-col gap-4">
              <span className="bg-surface-muted flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 text-[hsl(var(--accent))]">
                <action.icon className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {action.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              className="mt-6 w-fit gap-2 px-0 text-sm"
            >
              <Link
                href={action.href}
                className="group/link inline-flex items-center gap-2"
              >
                {action.cta}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-surface flex flex-col gap-3 rounded-2xl border border-border/50 p-5 shadow-[0_24px_80px_-70px_hsl(var(--shadow-soft))]"
          >
            <span className="bg-surface-muted flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 text-[hsl(var(--accent))]">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-surface rounded-3xl border border-border/60 p-6 shadow-[0_40px_120px_-80px_hsl(var(--shadow-soft))] sm:p-10">
        <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Guía rápida
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
              Listo para usar en tres pasos
            </h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {quickSteps.map((step) => (
            <div key={step.step} className="flex flex-col gap-3">
              <span className="bg-surface-muted flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-sm font-semibold text-foreground">
                {step.step}
              </span>
              <h3 className="text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted/80 space-y-4 rounded-2xl border border-border/50 p-6 text-sm text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <p>
          Todo se guarda en tu navegador. Recomendamos exportar plantillas e
          historial con regularidad para tener copias de seguridad y
          compartirlas con tu grupo.
        </p>
        <p>
          ¿Buscas algo más avanzado? Estamos construyendo una herramienta
          profesional para clubes y circuitos privados. Muy pronto compartiremos
          más detalles.
        </p>
      </section>
    </main>
  );
}
