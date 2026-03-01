import type  NavBarInterface from "../interfaces/NavBarInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import ButtonsNavBar from "./buttonsComponents/ButtonsComponet";
import { useNavigate } from "react-router";

export default function NavBar(navBarData : NavBarInterface) {
	const navigate = useNavigate();

	const logout = () => {
		navigate('/login');
	};

    const redirect = (url : string) => {
        console.log(url)
		navigate(url);
    }
	return (
		<header className="w-full bg-linear-to-r from-[#12a4a6] via-[#3f8cb4] to-[#4e6fb2] px-6 py-2">
			<div className="mx-auto flex w-full max-w-400 items-center justify-between gap-4">
				<div className="flex items-center gap-3 text-white">
					<div className="h-6 w-6 rounded-full border-[5px] border-[#e9f8fc]" />
					<h1 className="text-[20px] font-bold leading-none">{navBarData.nameBuild}</h1>
				</div>

				<div className="flex items-center">
					{navBarData.modules.map((module, index) => (
						<ButtonsNavBar
							key={`${module.text}-${index}`}
							text={module.text}
							typeButton="button"
							className="cursor-pointer mx-1 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2 text-[16px] font-semibold text-[#0f9daa] hover:text-[#075961] shadow-[0_4px_10px_rgba(14,83,124,0.15)]"
							icon={module.icon}
                            onClick={() => redirect(module.url)}
						/>
					))}
				</div>

				<div className="flex items-center gap-4 text-[16px] text-[#d7e7f7]">
					<p>
						Bienvenido, <span className="font-bold text-white">{navBarData.nameUser}</span>
					</p>
					<button
						type="button"
						className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#6d8ec2] px-5 py-2 text-[16px] font-bold text-white"
						onClick={logout}
					>
						<FontAwesomeIcon icon={faRightFromBracket} />
						<span>Cerrar Sesión</span>
					</button>
				</div>
			</div>
		</header>
	);
}