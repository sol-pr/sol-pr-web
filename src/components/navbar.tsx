"use client";
import React, { useCallback, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import NotifyIcon from "@/app/icons/notifyIcon";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { SmartContractService } from "@/services/SmartContractService";

const AppNavbar = () => {
  const { connected, publicKey } = useWallet();
  const smartContract = new SmartContractService();
  const handleWalletConnected = useCallback(() => {
    if (connected && publicKey) {
      console.log("Cüzdan Bağlandı:", publicKey.toString());
      // smartContract.createUser(
      //   "bgraokmush",
      //   Uint8Array.from(publicKey.toBytes())
      // );
    }
  }, [connected, publicKey]);

  useEffect(() => {
    handleWalletConnected();
  }, [connected, handleWalletConnected]);

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = ["Bounty", "New Repo", "Account"];
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="fixed top-0">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="dashboard" color="foreground" className="gap-2">
            <Image src={"/logo.png"} width={45} height={45} alt="logo" />
            <p className="font-bold font-mono">sol-pr</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-10" justify="center">
        <NavbarItem>
          <Link color="foreground" href="bounty">
            Bounty
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="new-repo">
            New Repo
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="my-account">
            Account
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <WalletMultiButtonDynamic
            style={{ background: "none", fontWeight: "normal" }}
          />
        </NavbarItem>
        <NavbarItem>
          <Button isIconOnly color="primary" variant="flat">
            <NotifyIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default AppNavbar;
