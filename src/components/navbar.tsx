"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { SmartContractService } from "@/services/SmartContractService";
import { BellRing, Github } from "lucide-react";
import { Register } from "@/Schema/models/Register";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const AppNavbar = () => {
  const router = useRouter();
  const { connected, publicKey, disconnect } = useWallet(); // disconnect ekledik
  const smartContract = new SmartContractService();
  const pathname = usePathname();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = ["Bounty", "New Repo", "Account"];
  const menuLinks = ["/bounty", "/new-repo", "/my-account"];

  const [formData, setFormData] = useState<Register>({
    githubUsername: "",
  });

  // Cache'e kaydetme işlemi
  const savePublicKeyToCache = (publicKey: string) => {
    Cookies.set("publicKey", publicKey, { expires: 7 }); // 7 gün süreyle saklar
  };

  // Cache'den silme işlemi
  const clearPublicKeyFromCache = () => {
    Cookies.remove("publicKey");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResigter = async () => {
    if (connected && publicKey) {
      const response = await smartContract.createUser(
        formData.githubUsername,
        publicKey.toBytes()
      );

      if (!response) {
        toast.error(`someting wrong :()`, {
          icon: "😥",
          style: {
            backgroundColor: "#000",
            borderBlockStyle: "solid",
            color: "#fff",
            border: "2px solid #FFFFFF40",
          },
        });
        router.push("/");
      }
      if (pathname === "/") {
        router.push("/dashboard");
      }

      toast.success(`Welcome ${formData.githubUsername}`, {
        icon: "👋",
        style: {
          backgroundColor: "#000",
          borderBlockStyle: "solid",
          color: "#fff",
          border: "2px solid #FFFFFF40",
        },
      });
    }
  };

  const handleWalletConnected = useCallback(async () => {
    if (connected && publicKey) {
      const publicKeyString = publicKey.toBase58();
      savePublicKeyToCache(publicKeyString); // Cache'e publicKey kaydediyoruz

      const hasUser = await smartContract.getUser(publicKey.toBytes());
      if (!hasUser.isSuccessful) {
        onOpen();
      } else {
        if (pathname === "/") {
          toast.success(`Welcome back, ${hasUser.user?.github_username}! `, {
            icon: "👋",
            style: {
              backgroundColor: "#000",
              borderBlockStyle: "solid",
              color: "#fff",
              border: "2px solid #FFFFFF40",
            },
          });
          router.push("/dashboard");
        }
      }
    }
  }, [connected, publicKey]);

  const handleWalletDisconnected = useCallback(() => {
    if (!connected) {
      clearPublicKeyFromCache(); // Cache'den publicKey'i siliyoruz
    }
  }, [connected]);

  useEffect(() => {
    handleWalletConnected();
    handleWalletDisconnected();
  }, [connected, handleWalletConnected, handleWalletDisconnected]);

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="fixed top-0 dark text-foreground bg-background purple-dark"
      >
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
              <BellRing size={18} />
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="dark text-foreground bg-background purple-dark">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color="foreground"
                href={menuLinks[index]}
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="dark text-foreground bg-background purple-dark"
        backdrop="blur"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-xl">Seems like you are new here!</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <Github size={18} className="text-foreground-500" />
                  }
                  label="Github Username"
                  variant="bordered"
                  className="font-mono"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleInputChange}
                />
                <p className="text-foreground-500 text-sm">
                  With your github username, we setting up your register
                  proccess. Using this accont, you can earn{" "}
                  <span className="text-primary-700">$SOL</span>{" "}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => handleResigter()}
                >
                  Register!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppNavbar;
