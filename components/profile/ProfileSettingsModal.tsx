"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, Button, Input, Badge } from "@/components/brutal";
import { X, User, Mail, Shield, Bell, Check, Save } from "lucide-react";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [notifyOnRegister, setNotifyOnRegister] = useState(true);
  const [notifyOnCheckIn, setNotifyOnCheckIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md">
        <Card className="bg-[#FFFDF5] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE800] border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
                Settings
              </span>
              <h3 className="font-black text-xl text-black">Profile & Preferences</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 border-2 border-black bg-white hover:bg-[#FF66C4] active:translate-x-0.5 active:translate-y-0.5 transition-colors shadow-[2px_2px_0px_0px_#000]"
              title="Close Modal"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Account Info */}
            <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-neutral-600">Account Identity</span>
                <span className="text-[10px] font-mono uppercase bg-black text-[#FFE800] px-1.5 py-0.5 font-bold">
                  {user.provider}
                </span>
              </div>
              <div className="text-xs font-mono text-neutral-700 truncate">
                <span className="font-bold">Email:</span> {user.email}
              </div>
              <div className="text-[11px] font-mono text-neutral-500 truncate">
                <span className="font-bold">ID:</span> {user.id}
              </div>
            </div>

            {/* Display Name Field */}
            <div>
              <label className="text-xs font-black uppercase text-neutral-800 block mb-1">
                Organizer Display Name
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            {/* Notifications Preferences */}
            <div className="space-y-2 pt-1 border-t-2 border-black/20">
              <span className="text-xs font-black uppercase text-neutral-800 block">
                Ops Notifications
              </span>
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnRegister}
                  onChange={(e) => setNotifyOnRegister(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                Email alert on new team registration
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnCheckIn}
                  onChange={(e) => setNotifyOnCheckIn(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                Instant alert on check-in desk arrivals
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t-2 border-black">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSaved}>
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-black" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1 text-black" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
