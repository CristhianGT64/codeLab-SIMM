import type NavBarInterface from "../interfaces/NavBarInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "./buttonsComponents/ButtonsComponet";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function NavBar(navBarData: Readonly<NavBarInterface>) {
  const navigate = useNavigate();

  const { user, logout, tienePermiso } = useAuth();

  const logoutLogin = () => {
    logout();
    navigate("/login");
  };

  const redirect = (url: string) => {
    navigate(url);
  };

  const modulosVisibles = navBarData.modules.filter(
    (m) => !m.permiso || tienePermiso(m.permiso),
  );

  return (
    <header className="w-full bg-linear-to-r from-[#12a4a6] via-[#3f8cb4] to-[#4e6fb2] px-6 py-2">
      <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-4">
        <button
          className="flex items-center gap-3 text-white cursor-pointer"
          onClick={() => redirect("/dashboard")}
        >
          <div className="h-6 w-6 rounded-full border-[5px] border-[#e9f8fc]" />
          <h1 className="text-[20px] font-bold leading-none">
            {navBarData.nameBuild}
          </h1>
        </button>

        <div className="flex items-center">
          {modulosVisibles.map((module, index) => (
            <ButtonsComponet
              key={`${module.text}-${index}`}
              text={module.text}
              typeButton="button"
              className="group relative mx-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white text-[16px] font-semibold text-[#0f9daa] shadow-[0_4px_10px_rgba(14,83,124,0.15)] transition-[width,color,box-shadow] duration-600 ease-out hover:text-[#075961] focus-visible:text-[#075961] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9adce2] md:hover:w-44 md:focus-visible:w-44 md:hover:justify-start md:focus-visible:justify-start md:hover:px-3 md:focus-visible:px-3"
              labelClassName="hidden max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 ease-out md:inline md:ml-2 md:group-hover:max-w-28 md:group-hover:opacity-100 md:group-focus-visible:max-w-28 md:group-focus-visible:opacity-100"
              icon={module.icon}
              onClick={() => redirect(module.url)}
              disabled={module.disable}
              ariaLabel={module.text}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 text-[16px] text-[#d7e7f7]">
          <p>
            Bienvenido,{" "}
            <span className="font-bold text-white">{user?.usuario}</span>
          </p>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#6d8ec2] px-5 py-2 text-[16px] font-bold text-white"
            onClick={logoutLogin}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
