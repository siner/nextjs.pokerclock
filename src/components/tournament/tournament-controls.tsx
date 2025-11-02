"use client";

import { Button } from "@/components/ui/button";
import {
  CoinsIcon,
  DollarSignIcon,
  MinusIcon,
  PlusIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";

interface TournamentControlsProps {
  players: number;
  entries: number;
  addons: number;
  doubleAddons: number;
  addonsEnabled: {
    simple: boolean;
    double: boolean;
  };
  entriesStatus: {
    closed: boolean;
    message: string;
  };
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  onAddEntry: () => void;
  onRemoveEntry: () => void;
  onAddAddon: () => void;
  onRemoveAddon: () => void;
  onAddDoubleAddon: () => void;
  onRemoveDoubleAddon: () => void;
}

function ControlCard({
  icon: Icon,
  label,
  value,
  onIncrement,
  onDecrement,
  disabledIncrement,
  disabledDecrement,
  helper,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabledIncrement?: boolean;
  disabledDecrement?: boolean;
  helper?: string;
}) {
  return (
    <div className="bg-surface flex flex-1 flex-col gap-4 rounded-2xl border border-border/60 p-5 shadow-[0_26px_90px_-70px_hsl(var(--shadow-soft))]">
      <div className="flex items-center gap-3">
        <span className="bg-surface-muted flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 text-[hsl(var(--accent))]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {label}
          </span>
          {helper && (
            <span className="text-xs text-muted-foreground">{helper}</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10"
          onClick={onDecrement}
          disabled={disabledDecrement}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10"
          onClick={onIncrement}
          disabled={disabledIncrement}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function TournamentControls({
  players,
  entries,
  addons,
  doubleAddons,
  addonsEnabled,
  entriesStatus,
  onAddPlayer,
  onRemovePlayer,
  onAddEntry,
  onRemoveEntry,
  onAddAddon,
  onRemoveAddon,
  onAddDoubleAddon,
  onRemoveDoubleAddon,
}: TournamentControlsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      <ControlCard
        icon={UsersIcon}
        label="Jugadores"
        value={players}
        onIncrement={onAddPlayer}
        onDecrement={onRemovePlayer}
        disabledIncrement={entriesStatus.closed}
        disabledDecrement={players === 0}
        helper={entriesStatus.closed ? "Entradas cerradas" : undefined}
      />

      <ControlCard
        icon={DollarSignIcon}
        label="Entradas"
        value={entries}
        onIncrement={onAddEntry}
        onDecrement={onRemoveEntry}
        disabledIncrement={entriesStatus.closed}
        disabledDecrement={entries === 0}
        helper={entriesStatus.message}
      />

      {addonsEnabled.simple && (
        <ControlCard
          icon={CoinsIcon}
          label="Add-ons"
          value={addons}
          onIncrement={onAddAddon}
          onDecrement={onRemoveAddon}
          disabledDecrement={addons === 0}
        />
      )}

      {addonsEnabled.double && (
        <ControlCard
          icon={TrophyIcon}
          label="Doble add-on"
          value={doubleAddons}
          onIncrement={onAddDoubleAddon}
          onDecrement={onRemoveDoubleAddon}
          disabledDecrement={doubleAddons === 0}
        />
      )}
    </section>
  );
}
