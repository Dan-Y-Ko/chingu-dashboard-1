"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Avatar } from "@chingu-x/components/avatar";
import Image from "next/image";
import { Button } from "@chingu-x/components/button";
import UserDropDown from "@/shared/components/navbar/UserDropdown";
import routePaths from "@/shared/utils/routePaths";
import { useAuthStateSelector } from "@/features/auth/hooks/useAuthStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

export default function AuthHeader() {
  const { isAuthenticated } = useAuthStateSelector();
  const { avatar } = useUserStateSelector();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // TODO: refactor to custom hook
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return isAuthenticated ? (
    <>
      <div
        ref={menuRef}
        data-cy="nav-dropdown-menu"
        onClick={toggleMenu}
        className="flex items-center px-2"
      >
        <Avatar customClassName="h-[34px] w-[34px]">
          <Image src={avatar} alt="user avatar" width={34} height={34} />
        </Avatar>

        <UserDropDown openState={isMenuOpen} />
      </div>
    </>
  ) : (
    <Link href={routePaths.signIn()}>
      <Button>Log In</Button>
    </Link>
  );
}
