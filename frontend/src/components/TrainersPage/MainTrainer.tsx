"use client";
import React from "react";
import ChromaGridImport from "./TrainersGrid";
const ChromaGrid = ChromaGridImport as unknown as React.ComponentType<any>;

const MainTrainer = () => {
  return (
    <div>
      <div className="my-[100px] ">
        <div style={{ height: "800px", position: "relative" }}>
          <ChromaGrid
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>
      </div>
    </div>
  );
};

export default MainTrainer;
