"use client";
import { PencilIcon, PlayIcon, TrashIcon, WalletIcon } from "lucide-react";

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

  return (
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
              <TableHead>
                <span className="sr-only">Actions</span>
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
                        <PlayIcon className="size-4" />
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
                        <DialogContent className="bg-white">
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
  );
}
