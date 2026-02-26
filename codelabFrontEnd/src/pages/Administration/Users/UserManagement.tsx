import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonsComponet from '../../../components/buttonsComponents/ButtonsComponet';
import {
	faMagnifyingGlass,
	faPowerOff,
	faPenToSquare,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import CardTtoalComponent from '../../../components/cardTotalComponent/CardTotalComponent';

type UserRole = 'Administrador' | 'Editor' | 'Visualizador';

interface User {
	id: number;
	fullName: string;
	username: string;
	email: string;
	role: UserRole;
	branch: string;
	status: 'Activo' | 'Inactivo';
}

const users: User[] = [
	{
		id: 1,
		fullName: 'Juan Pérez',
		username: 'jperez',
		email: 'juan.perez@example.com',
		role: 'Administrador',
		branch: 'Sucursal Central',
		status: 'Activo',
	},
	{
		id: 2,
		fullName: 'María González',
		username: 'mgonzalez',
		email: 'maria.gonzalez@example.com',
		role: 'Editor',
		branch: 'Sucursal Norte',
		status: 'Activo',
	},
	{
		id: 3,
		fullName: 'Carlos Rodríguez',
		username: 'crodriguez',
		email: 'carlos.rodriguez@example.com',
		role: 'Visualizador',
		branch: 'Sucursal Sur',
		status: 'Activo',
	},
];

const roleStyles: Record<UserRole, string> = {
	Administrador: 'bg-[#104f78] text-white',
	Editor: 'bg-[#0aa6a2] text-white',
	Visualizador: 'bg-[#9dd8df] text-[#0a4d76]',
};

export default function UserManagement() {
	const totalUsers = users.length;
	const activeUsers = users.filter((user) => user.status === 'Activo').length;
	const inactiveUsers = users.filter((user) => user.status === 'Inactivo').length;

	return (
		<section className="w-full px-4 py-5 md:px-6">
			<header>
				<h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">Gestión de Usuarios</h2>
				<p className="mt-1 text-lg text-[#4661b0] md:text-xl">Administra los usuarios del sistema</p>
			</header>

			<div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
						<FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg text-[#9adce2]" />
						<input
							type="text"
							placeholder="Buscar usuarios..."
							className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
						/>
					</label>

                    <ButtonsComponet
                        text='Nuevo Usuario'
                        typeButton='button'
                        className='cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg'
                        icon="fa-solid fa-plus"
                        onClick={() => console.log('Creando nuevo usuario')}
                    />
				</div>
			</div>

			<div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-left text-white">
							<th className="px-6 py-4 text-base font-semibold md:text-lg">Nombre Completo</th>
							<th className="px-4 py-4 text-base font-semibold md:text-lg">Usuario</th>
							<th className="px-4 py-4 text-base font-semibold md:text-lg">Correo</th>
							<th className="px-4 py-4 text-base font-semibold md:text-lg">Rol</th>
							<th className="px-4 py-4 text-base font-semibold md:text-lg">Sucursal</th>
							<th className="px-4 py-4 text-base font-semibold md:text-lg">Estado</th>
							<th className="px-4 py-4 text-base font-semibold md:text-lg">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id} className="border-b border-[#9adce2] last:border-b-0">
								<td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">{user.fullName}</td>
								<td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">{user.username}</td>
								<td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">{user.email}</td>
								<td className="px-4 py-4">
									<span className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold md:text-base ${roleStyles[user.role]}`}>
										{user.role}
									</span>
								</td>
								<td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">{user.branch}</td>
								<td className="px-4 py-4">
									<span className="inline-flex rounded-full bg-[#b7e4ca] px-4 py-1 text-sm font-semibold text-[#008444] md:text-base">
										{user.status}
									</span>
								</td>
								<td className="px-4 py-4">
									<div className="flex items-center gap-4 text-lg md:text-xl">
										<button type="button" className="text-[#ff5e00]" aria-label={`Cambiar estado de ${user.fullName}`}>
											<FontAwesomeIcon icon={faPowerOff} />
										</button>
										<button type="button" className="text-[#00a3b8]" aria-label={`Editar ${user.fullName}`}>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
										<button type="button" className="text-[#ff0000]" aria-label={`Eliminar ${user.fullName}`}>
											<FontAwesomeIcon icon={faTrashCan} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-3">
                <CardTtoalComponent
                    title='Total de Usuarios'
                    total={totalUsers}
                    colorNumber='text-[#0a4d76]'
                />
                <CardTtoalComponent
                    title='Usuarios Activos'
                    total={activeUsers}
                    colorNumber='text-[#009b3a]'
                />
                <CardTtoalComponent
                    title='Usuarios Inactivos'
                    total={inactiveUsers}
                    colorNumber='text-[#e10000]'
                />
			</div>
		</section>
	);
}
