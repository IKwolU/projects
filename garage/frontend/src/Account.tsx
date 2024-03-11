import selca from "./assets/placeholders/selca.png";
import frontDriverId from "./assets/placeholders/front-driver-id.png";
import backDriverId from "./assets/placeholders/back-driver-id.png";
import frontPassport from "./assets/placeholders/front-passport.png";
import backPassport from "./assets/placeholders/back-passport.png";
import { Button } from "@/components/ui/button";
import FileInput from "@/components/ui/file-input";
import { useState } from "react";
import { client } from "./backend";
import { DriverDocumentType, User, UserStatus } from "./api-client";
import { useSetRecoilState } from "recoil";
import { userAtom } from "./atoms";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import QRCode from "qrcode.react";

export const Account = ({ user }: { user: User }) => {
  const setUser = useSetRecoilState(userAtom);
  // const [showQRCode, setShowQRCode] = useState(false);

  const [docs] = useState<
    {
      type: DriverDocumentType;
      url?: string;
      title: string;
      placeholderImg: string;
    }[]
  >([
    {
      title:
        "Селфи при хорошем освещении c главным разворотом страниц паспорта",
      type: DriverDocumentType.Image_fase_and_pasport,
      placeholderImg: selca,
    },
    {
      title: "Лицевая сторона водительского удостоверения",
      type: DriverDocumentType.Image_licence_front,
      placeholderImg: frontDriverId,
    },
    {
      title: "Обратная сторона водительского удостоверения",
      type: DriverDocumentType.Image_licence_back,
      placeholderImg: backDriverId,
    },
    {
      title: "Разворот страниц паспорта с фото",
      type: DriverDocumentType.Image_pasport_front,
      placeholderImg: frontPassport,
    },
    {
      title: "Разворот страниц паспорта с пропиской",
      type: DriverDocumentType.Image_pasport_address,
      placeholderImg: backPassport,
    },
  ]);
  // lol wtf ejection
  if (!user) {
    return <></>;
  }
  // const referralLink = `https://api.gar77.ru/driver/login?code=${user.referral_info?.referral_code}`;
  const requiredDocumentCount = docs.length;
  const uploadedDocumentCount = user.docs?.filter((x) => !!x.url).length || 0;

  const onFileSelected = async (
    file: File,
    documentType: DriverDocumentType
  ) => {
    await client.uploadFile(
      {
        fileName: "any",
        data: file,
      },
      documentType
    );

    const userData = await client.getUser();
    setUser(userData.user!);

    // const updatedDocs = user.docs!.map((x) => {
    //   const shallowCopy = new Docs({ ...x });

    //   if (x.type === documentType) {
    //     shallowCopy.url = url;
    //   }
    //   return shallowCopy;
    // });

    // setUser(new User({ ...user, docs: [...updatedDocs] }));
  };

  const logout = async () => {
    try {
      await client.logout();
    } catch (error) {}

    localStorage.clear();
    window.location.href = "/";
  };

  // const handleShowQRCode = () => {
  //   setShowQRCode(true);
  // };

  // const handleShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "Мой гараж",
  //         text: "Присоединитесь к реферральной программе",
  //         url: referralLink,
  //       });
  //     } catch (error) {
  //       console.error("Ошибка при попытке поделиться:", error);
  //     }
  //   } else {
  //     console.log("Web Share API не поддерживается в вашем браузере");
  //   }
  // };

  // const handleCopy = () => {
  //   navigator.clipboard
  //     .writeText(referralLink)
  //     .then(() => {
  //       console.log("Link copied to clipboard");
  //       // You can add any additional functionality here after successful copy
  //     })
  //     .catch((error) => {
  //       console.error("Failed to copy: ", error);
  //     });
  // };

  return (
    <>
      {/* {!!user.referral_info && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Реферральная программа</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Реферральная программа</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-3 text-xl">
              <div className="flex justify-center space-x-2 text-xl">
                <span>Заработано баллов:</span>
                <span>{user.referral_info?.coins}</span>
              </div>
              <div className="mx-auto text-center">
                Ваша реферральная ссылка:{" "}
                <div className="font-semibold">{referralLink}</div>
              </div>
              <a
                href="#"
                // onClick={handleShare}
                onClick={handleCopy}
                className="mx-auto max-w-[250px] w-full"
              >
                <Button>Копировть</Button>
              </a>
              {showQRCode ? (
                <div className="flex justify-center w-full mx-auto max-w-96">
                  <QRCode
                    value={referralLink}
                    className="w-full mx-auto max-w-96"
                    size={300}
                  />
                </div>
              ) : (
                <Button
                  className="mx-auto max-w-[250px]"
                  onClick={handleShowQRCode}
                >
                  Показать QR-код
                </Button>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <div className="fixed bottom-0 flex w-full p-2">
                  <Button className="mx-auto max-w-[250px]">Назад</Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}
      <div className="mx-auto w-80 sm:w-full sm:mx-0">
        <h1 className="mt-8 text-center md:text-2xl">
          Подтвердите свою личность
        </h1>

        {user.user_status === UserStatus.DocumentsNotUploaded && (
          <>
            <p className="max-w-sm p-4 mx-auto text-xs font-bold text-center text-white rounded-lg md:max-w-lg md:text-xl bg-gradient-to-br from-amber-600 to-red">
              Вы не можете начать процесс бронирования пока не загрузили
              документы или документы не прошли верификацию
            </p>
            <h1 className="mt-4 text-3xl text-center text-red">
              {uploadedDocumentCount}/{requiredDocumentCount}
            </h1>
          </>
        )}

        {user.user_status === UserStatus.Verification && (
          <p className="p-4 text-xs font-bold text-center text-white rounded-lg bg-gradient-to-br from-sky-300 to-sky-800 md:max-w-lg">
            Верификация в процессе
          </p>
        )}

        {user.user_status === UserStatus.Verified && (
          <p className="p-4 text-xs font-bold text-center text-white rounded-lg bg-gradient-to-br from-green-400 to-green-800 md:max-w-lg">
            Вы прошли верификацию
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {docs.map(({ title, type, placeholderImg }) => {
            const actualUrl =
              user.docs?.find((doc) => doc.type === type)?.url ||
              placeholderImg;

            return (
              <div
                key={type}
                className="p-4 my-4 text-center rounded-lg shadow max-w-[320px] md:max-w-[540px] md:flex md:flex-col md:justify-between"
              >
                <p className="md:text-xl">{title}</p>
                <img
                  className="mx-auto my-8 md:max-h-96"
                  src={actualUrl}
                  alt=""
                />
                <div className="text-center md:text-xl">
                  <FileInput
                    title="Загрузить"
                    onChange={(fileList) => onFileSelected(fileList[0], type)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="my-8 text-center max-w-[320px] mx-auto">
          <Button variant="reject" className="md:text-xl" onClick={logout}>
            Выйти из приложения
          </Button>
        </div>
      </div>
    </>
  );
};
