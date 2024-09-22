"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EuroIcon, MinusIcon, PercentIcon, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useEffect, useState } from "react";
import {
  type GameTemplate,
  type Level,
  type Prize,
  type PrizeStructure,
} from "@/types";

export default function GameTemplateForm({
  gametemplate,
}: {
  gametemplate?: GameTemplate;
}) {
  const [newGameTemplate, setnewGameTemplate] = useState<GameTemplate>(
    gametemplate ? (gametemplate as GameTemplate) : ({} as GameTemplate)
  );

  function manageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setnewGameTemplate({ ...newGameTemplate, [name]: value });
  }
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [levels, setLevels] = useState<Level[]>(newGameTemplate.levels ?? []);

  const [prizeStructures, setPrizeStructures] = useState<PrizeStructure[]>(
    newGameTemplate.prize_structures ?? []
  );

  function addPrizeStructure() {
    setPrizeStructures([
      ...prizeStructures,
      {
        max_players: "",
        prizes: [],
      } as unknown as PrizeStructure,
    ]);
  }

  function manageInputMaxPlayersChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value } = e.target;
    setPrizeStructures(
      prizeStructures.map((prizeStructure, i) =>
        i === index
          ? ({
              ...prizeStructure,
              max_players: value,
            } as unknown as PrizeStructure)
          : prizeStructure
      )
    );
  }

  function manageInputPrizeChange(
    index: number,
    prizeIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value } = e.target;
    setPrizeStructures(
      prizeStructures.map((prizeStructure, i) =>
        i === index
          ? ({
              ...prizeStructure,
              prizes: prizeStructure.prizes.map((prize, j) =>
                j === prizeIndex ? { ...prize, percentaje: value } : prize
              ),
            } as unknown as PrizeStructure)
          : prizeStructure
      )
    );
  }

  function addPercentaje(index: number) {
    setPrizeStructures(
      prizeStructures.map((prizeStructure, i) =>
        i === index
          ? ({
              ...prizeStructure,
              prizes: [
                ...prizeStructure.prizes,
                {
                  percentaje: "",
                } as unknown as Prize,
              ],
            } as unknown as PrizeStructure)
          : prizeStructure
      )
    );
  }

  useEffect(() => {
    setnewGameTemplate({
      ...newGameTemplate,
      prize_structures: prizeStructures,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizeStructures]);

  useEffect(() => {
    setnewGameTemplate({ ...newGameTemplate, levels: levels });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels]);

  function addLevel() {
    setLevels([...levels, { sb: 0, bb: 0, ante: 0, time: 0 } as Level]);
  }

  function removeLevel(index: number) {
    setLevels(levels.filter((_level, i) => i !== index));
  }

  function manageInputLevelChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setLevels(
      levels.map((level, i) =>
        i === index ? { ...level, [name]: value } : level
      )
    );
  }

  const [error, setError] = useState(false);

  function updateGameTemplate() {
    if (
      !newGameTemplate.name ||
      !newGameTemplate.entry ||
      !newGameTemplate.points ||
      !newGameTemplate.levels ||
      !newGameTemplate.prize_structures
    ) {
      toast({
        description: "Faltan algunos campos por rellenar",
        variant: "destructive",
      });
      setError(true);
      return;
    }
    setLoading(true);

    if (gametemplate) {
      // Update game in local storage
    } else {
      newGameTemplate.id = Math.floor(Math.random() * 1000000000);

      localStorage.setItem(
        "gameTemplates",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("gameTemplates") || "[]"),
          newGameTemplate,
        ])
      );
      toast({
        description: "Torneo creado correctamente",
      });
      router.push("/gametemplates");
    }
  }

  return (
    <>
      <div className="grid w-full gap-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="buyin">Nombre</Label>
            <Input
              id="name"
              type="text"
              name="name"
              className="w-full"
              defaultValue={newGameTemplate.name}
              onChange={manageInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="buyin">Entrada</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="entry"
                type="text"
                name="entry"
                className={
                  "w-full " +
                  (error && !newGameTemplate.entry ? "border-red-500" : "")
                }
                defaultValue={newGameTemplate.entry}
                onChange={manageInputChange}
              />
              <EuroIcon className="size-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="fee">Comisión</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="fee"
                type="text"
                name="fee"
                className="w-full"
                defaultValue={newGameTemplate.fee}
                onChange={manageInputChange}
              />
              <PercentIcon className="size-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="points">Puntos iniciales</Label>
            <Input
              id="points"
              type="text"
              name="points"
              className={
                "w-full " +
                (error && !newGameTemplate.points ? "border-red-500" : "")
              }
              defaultValue={newGameTemplate.points}
              onChange={manageInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="extrapot">Bote extra inicio</Label>
            <Input
              id="extrapot"
              type="text"
              name="extrapot"
              className="w-full"
              defaultValue={newGameTemplate.extrapot}
              onChange={manageInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="buyin">Premio Burbuja</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="bubble"
                type="text"
                name="bubble"
                className="w-full"
                defaultValue={newGameTemplate.bubble}
                onChange={manageInputChange}
              />
              <EuroIcon className="size-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="fee">Addon</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="addon_price"
                type="text"
                name="addon_price"
                className="w-full"
                defaultValue={newGameTemplate.addon_price}
                onChange={manageInputChange}
              />
              <EuroIcon className="size-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="points">Puntos Addon</Label>
            <Input
              id="addon_points"
              type="text"
              name="addon_points"
              className="w-full"
              defaultValue={newGameTemplate.addon_points}
              onChange={manageInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="fee">Doble addon</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="fee"
                type="text"
                name="double_addon_price"
                className="w-full"
                defaultValue={newGameTemplate.double_addon_price}
                onChange={manageInputChange}
              />
              <EuroIcon className="size-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="points">Puntos Doble Addon</Label>
            <Input
              id="points"
              type="text"
              name="double_addon_points"
              className="w-full"
              defaultValue={newGameTemplate.double_addon_points}
              onChange={manageInputChange}
            />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Niveles</h2>
          <div className="mb-4 flex flex-col space-y-3">
            <div className="grid grid-cols-5 gap-3">
              <span>Ciega pequeña</span>
              <span>Ciega grande</span>
              <span>Ante</span>
              <span>Minutos</span>
              <span></span>
            </div>
            {levels.map((level, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-3"
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                }}
              >
                <Input
                  id="sb"
                  type="number"
                  name="sb"
                  className="w-full"
                  defaultValue={level.sb ?? ""}
                  onChange={(e) => manageInputLevelChange(index, e)}
                />
                <Input
                  id="bb"
                  type="number"
                  name="bb"
                  className="w-full"
                  defaultValue={level.bb ?? ""}
                  onChange={(e) => manageInputLevelChange(index, e)}
                />
                <Input
                  id="ante"
                  type="number"
                  name="ante"
                  className="w-full"
                  defaultValue={level.ante ?? ""}
                  onChange={(e) => manageInputLevelChange(index, e)}
                />
                <Input
                  id="time"
                  type="number"
                  name="time"
                  className="w-full"
                  defaultValue={level.time ?? ""}
                  onChange={(e) => manageInputLevelChange(index, e)}
                />
                <Button onClick={() => removeLevel(index)} size="icon">
                  <MinusIcon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addLevel} size="icon">
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Estructura de premios</h2>

          <Accordion type="single" collapsible className="w-full">
            {prizeStructures.map((prizeStructure, index) => (
              <AccordionItem
                key={index}
                value={"item-" + index}
                className="mb-4"
              >
                <AccordionTrigger>
                  <Input
                    key={index}
                    type="number"
                    name="maxplayers"
                    placeholder="Jugadores"
                    className="w-32"
                    defaultValue={prizeStructure.max_players}
                    onChange={(e) => manageInputMaxPlayersChange(index, e)}
                  />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-3">
                  {prizeStructure.prizes.map((prize, prizeindex) => (
                    <div
                      key={prizeindex}
                      className="flex w-full max-w-sm items-center space-x-2"
                    >
                      <Input
                        type="number"
                        name="prize"
                        className="w-24"
                        defaultValue={prize.percentaje}
                        onChange={(e) =>
                          manageInputPrizeChange(index, prizeindex, e)
                        }
                      />
                      <PercentIcon className="size-4 text-gray-400" />
                    </div>
                  ))}
                  <Button onClick={() => addPercentaje(index)} size="icon">
                    <PlusIcon className="size-4" />
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button onClick={addPrizeStructure} size="icon">
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            size="sm"
            onClick={() => updateGameTemplate()}
            disabled={loading}
          >
            {loading ? "Saving ..." : "Save"}
          </Button>
        </div>
      </div>
    </>
  );
}
