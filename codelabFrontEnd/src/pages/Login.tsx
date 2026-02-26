import { useState } from "react";
import settings from "../lib/settings";
import ButtonLogin from "../components/buttonsComponents/buttonLoginComponent";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const comprobateUser = () : void => {
        console.log('Usuario: ' + email + ' contrasena : ' + password + ' recordar: ' + rememberMe)
    }

    const year = settings.year;

	return (
		<main className="grid min-h-screen w-screen place-items-center bg-linear-to-br from-[#4a6eb0] via-[#1498b2] to-[#00a99d] p-6 box-border">
			<div className="grid w-full max-w-108 gap-6">
				<section className="overflow-hidden rounded-[22px] bg-[#efefef] shadow-[0_20px_45px_rgba(10,64,89,0.28)]">
					<header className="flex flex-col items-center bg-linear-to-r from-[#11a2a5] to-[#4a6eb0] px-7 pb-7 pt-8 text-center">
						<div className="mb-3 h-13 w-13 rounded-full border-[6px] border-[#eaf5f8]" />
						<h1 className="m-0 text-[42px] font-bold leading-none text-white">Bienvenido</h1>
						<p className="mt-2 text-[28px] text-[#d5eff5]">Inicia sesión en tu cuenta</p>
					</header>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							comprobateUser();
						}}
						className="grid gap-5 px-7 pb-8 pt-7"
					>
						<label className="grid gap-2 text-[20px] font-semibold text-[#1f4f6f]">
							<span>Correo electrónico</span>
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
								placeholder="tu@email.com"
								className="rounded-[14px] border-2 border-[#9dd0d8] bg-transparent px-4 py-3 text-[22px] text-[#3a5b74] outline-none placeholder:text-[#93a4b2] focus:border-[#4a6eb0]"
							/>
						</label>

						<label className="grid gap-2 text-[20px] font-semibold text-[#1f4f6f]">
							<span>Contraseña</span>
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
								placeholder="••••••••"
								className="rounded-[14px] border-2 border-[#9dd0d8] bg-transparent px-4 py-3 text-[22px] text-[#3a5b74] outline-none placeholder:text-[#93a4b2] focus:border-[#4a6eb0]"
							/>
						</label>

						<div className="mt-1 flex items-center justify-between text-[18px] text-[#4b7292]">
							<label className="inline-flex items-center gap-2 font-semibold">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(event) => setRememberMe(event.target.checked)}
									className="h-4 w-4 accent-[#3f699b]"
								/>
								<span>Recordarme</span>
							</label>
							<button type="button" className="cursor-pointer font-medium text-[#2fa6b7] hover:underline">
								¿Olvidaste tu contraseña?
							</button>
						</div>

                        <ButtonLogin
                            text={'Iniciar sesión'}
                            typeButton={'button'}
                            className='cursor-pointer mt-1 w-full rounded-[14px] bg-linear-to-r from-[#0fa2a3] to-[#4a6eb0] px-4 py-3 text-[32px] font-bold text-white transition-opacity hover:opacity-90'
                            onClick={comprobateUser}
                        />

					</form>
				</section>

				<p className="text-center text-[15px] text-[#d8eef1]">
					© {year} Codelab Login. Todos los derechos reservados.
				</p>
			</div>
		</main>
	);
}
