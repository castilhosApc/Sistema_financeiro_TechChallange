"use client";

import React from "react";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import { getUserName, getUserEmail } from "../../config/user";

const Header = () => {
  return (
    <header className="gradient-primary shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="glass rounded-xl w-16 h-16 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">$</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sistema Bancário</h1>
            <p className="text-white/80 text-sm">Fiap</p>
          </div>
        </div>
        
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="glass rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getUserName().charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{getUserName()}</p>
                <p className="text-xs text-white/70">{getUserEmail()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
