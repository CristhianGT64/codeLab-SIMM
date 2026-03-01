import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonsComponet from '../../../components/buttonsComponents/ButtonsComponet';
import {
	faMagnifyingGlass,
	faPowerOff,
	faPenToSquare,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import CardTtoalComponent from '../../../components/cardTotalComponent/CardTotalComponent';
import useUsers from '../../../hooks/UsersHooks/useUsers';
import { useNavigate } from 'react-router';
import useDeleteUser from '../../../hooks/UsersHooks/useDeleteUser';
import useInactiveUser from '../../../hooks/UsersHooks/useInactiveUser';
import useActiveUser from '../../../hooks/UsersHooks/useActiveUser';

const roleStyles: Record<string, string> = {
	ADMIN: 'bg-[#104f78] text-white',
	EDITOR: 'bg-[#0aa6a2] text-white',
	VISUALIZADOR: 'bg-[#9dd8df] text-[#0a4d76]',
};

export default function UserManagement() {
	const navigate = useNavigate();
	const deleteUserMutation = useDeleteUser();
	const inactiveUser = useInactiveUser();
	const activeUser = useActiveUser();
	const { data, isLoading, isError, error } = useUsers();
	const users = data?.data ?? [];

	const totalUsers = users.length;
	const activeUsers = users.filter((user) => user.estado.toLowerCase() === 'activo').length;
	const inactiveUsers = users.filter((user) => user.estado.toLowerCase() === 'inactivo').length;

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
						onClick={() => navigate('/Users-Management/Create-User')}
						disabled={false}
                    />
				</div>
			</div>

			<div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
				{isLoading && <p className="px-6 py-4 text-[#4661b0]">Cargando usuarios...</p>}
				{isError && <p className="px-6 py-4 text-[#c20000]">{error instanceof Error ? error.message : 'Error cargando usuarios'}</p>}
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
								<td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">{user.nombreCompleto}</td>
								<td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">{user.usuario}</td>
								<td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">{user.correo}</td>
								<td className="px-4 py-4">
									<span className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold md:text-base ${roleStyles[user.rol.nombre] ?? 'bg-[#9dd8df] text-[#0a4d76]'}`}>
										{user.rol.nombre}
									</span>
								</td>
								<td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">{user.sucursal.nombre}</td>
								<td className="px-4 py-4">
									<span className="inline-flex rounded-full bg-[#b7e4ca] text-[#008444] px-4 py-1 text-sm font-semibold  md:text-base">
										{user.estado === 'activo' ? 'Activo' : 'Inactivo'}
									</span>
								</td>
								<td className="px-4 py-4">
									<div className="flex items-center gap-4 text-lg md:text-xl">
										<button type="button" className= {`cursor-pointer ${user.estado === 'activo' ? 'text-[#ff5e00] hover:text-[#b64402]' :'text-[#24e775] hover:text-[#008444]' } `}
										aria-label={`Cambiar estado de ${user.nombreCompleto}`}
										onClick={user.estado === 'activo' ? () => inactiveUser.mutate(user.id) : () => activeUser.mutate(user.id)}
										>
											<FontAwesomeIcon icon={faPowerOff} />
										</button>
										<button
											type="button"
											onClick={() => navigate(`/Users-Management/Update-User/${user.id}`)}
											className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
											aria-label={`Editar ${user.nombreCompleto}`}
										>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
										<button
											type="button"
											onClick={() => deleteUserMutation.mutate(user.id)}
											className="cursor-pointer text-[#ff0000] hover:text-[#7d0202] "
											aria-label={`Eliminar ${user.nombreCompleto}`}
										>
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
