"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { trainers } from "@/data/trainers";

export function TrainersSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {trainers.map((trainer) => (
        <CardContainer key={trainer.slug} className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:bg-black w-full h-auto rounded-xl p-6 border">
            <CardItem translateZ="100" className="w-full">
              <img
                src={trainer.img}
                className="h-56 w-full object-cover rounded-xl"
                alt={trainer.name}
              />
            </CardItem>
            <CardItem
              translateZ="50"
              className="text-lg font-bold text-neutral-700 dark:text-white mt-4"
            >
              {trainer.name}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm mt-1 dark:text-neutral-300"
            >
              {trainer.role}
            </CardItem>
            <div className="flex justify-end mt-6">
              <CardItem translateZ={20} as="button">
                <Link
                  href={`/trainers/${trainer.slug}`}
                  className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold"
                >
                  View Profile
                </Link>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}
