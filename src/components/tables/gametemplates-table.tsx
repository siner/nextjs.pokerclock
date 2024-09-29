"use client";
import {
  CirclePlusIcon,
  DownloadIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  UploadIcon,
  WalletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { type GameTemplate } from "@/types";
import Link from "next/link";

export default function GameTemplatesTable({ title }: { title?: string }) {
  let gametemplates = [] as GameTemplate[];

  if (typeof window !== "undefined") {
    gametemplates = JSON.parse(
      localStorage.getItem("gameTemplates") || "[]"
    ) as GameTemplate[];
  }
  function removeTemplate(id: number) {
    const newGameTemplates = gametemplates.filter(
      (gametemplate) => gametemplate.id !== id
    );
    localStorage.setItem("gameTemplates", JSON.stringify(newGameTemplates));
    window.location.reload();
  }

  function backupGames() {
    const backup = JSON.parse(localStorage.getItem("gameTemplates") || "[]");
    const blob = new Blob([JSON.stringify(backup)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importGames(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const backup = JSON.parse(e.target?.result as string);
        localStorage.setItem("gameTemplates", JSON.stringify(backup));
        window.location.reload();
      };
      reader.readAsText(file);
    }
    e.target.value = "";
    window.location.reload();
  }

  return (
    <>
      <div className="flex items-center justify-end space-x-4 p-2 py-4">
        <Button variant="outline" onClick={backupGames}>
          <DownloadIcon className="mr-2 size-3" />
          Descargar
        </Button>
        <Dialog>
          <DialogTrigger>
            <Button variant="outline">
              <UploadIcon className="mr-2 size-3" />
              Importar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar plantillas</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col items-start gap-4 pt-4">
                  <p>
                    Esta acción eliminará las plantillas actuales y las
                    sustituirá por las que importes nuevas.
                  </p>
                  <p>Adjunta un fichero .json válido</p>
                  <input type="file" accept=".json" onChange={importGames} />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        {title && (
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>
                  <WalletIcon className="size-4" />
                </TableHead>
                <TableHead className="flex items-center justify-end pr-2">
                  <SettingsIcon className="size-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gametemplates.length > 0 ? (
                gametemplates.map((gametemplate) => (
                  <TableRow key={gametemplate.id}>
                    <TableCell>
                      <Link href={`/gametemplates/${gametemplate.id}`}>
                        {gametemplate.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {gametemplate.entry.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="icon">
                          <Link href={`/play?template=${gametemplate.id}`}>
                            <PlayIcon className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Link href={`/gametemplates/${gametemplate.id}`}>
                            <PencilIcon className="size-4" />
                          </Link>
                        </Button>
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="destructive" size="icon">
                              <TrashIcon className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                ¿Seguro que quieres borrar esta plantilla?
                              </DialogTitle>
                              <DialogDescription>
                                <div className="flex flex-col items-start gap-4 pt-4">
                                  <p>Esta acción no se puede deshacer.</p>
                                  <Button
                                    variant="destructive"
                                    size="lg"
                                    onClick={() =>
                                      removeTemplate(gametemplate.id)
                                    }
                                  >
                                    Borrar
                                  </Button>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex flex-col items-center justify-center gap-4">
                      <p>No hay plantillas de partidas.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-end pt-4">
        <Button variant="outline">
          <Link
            href="/gametemplates/create"
            className="flex items-center justify-start"
          >
            <PlusIcon className="mr-2 size-4" /> Nueva plantilla
          </Link>
        </Button>
      </div>
    </>
  );
}
