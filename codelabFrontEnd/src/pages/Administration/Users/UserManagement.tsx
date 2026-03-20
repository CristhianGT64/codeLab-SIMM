import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import CardTtoalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import useUsers from "../../../hooks/UsersHooks/useUsers";
import { useNavigate } from "react-router";
import useDeleteUser from "../../../hooks/UsersHooks/useDeleteUser";
import useInactiveUser from "../../../hooks/UsersHooks/useInactiveUser";
import useActiveUser from "../../../hooks/UsersHooks/useActiveUser";
import { TableUserData } from "../../../data/dataAdministrator/UserManagmentData";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import useAuth from "../../../hooks/useAuth";
import TableComponent from "../../../components/Table/TableComponent";
import TableUsersData from "../../../data/dataAdministrator/TablesData/TableUsersData";
import type { User } from "../../../interfaces/Users/UserInterface";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";

const ITEMS_POR_PAGINA = 5;

export default function UserManagement() {
  const navigate = useNavigate();
  const { tienePermiso } = useAuth();
  const deleteUserMutation = useDeleteUser();
  const inactiveUser = useInactiveUser();
  const activeUser = useActiveUser();
  const { data, isLoading, isError, error } = useUsers();
  const users = data?.data ?? [];
  const tableHeader: string[] = TableUserData;
  const headerAdmin: HeaderAdmin = {
    title: "Gestión de Usuarios",
    subTitle: "Administra los usuarios del sistema",
  };

  const { totalUsers, activeUsers, inactiveUsers } = useMemo(
    () => ({
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.estado.toLowerCase() === "activo")
        .length,
      inactiveUsers: users.filter((u) => u.estado.toLowerCase() === "inactivo")
        .length,
    }),
    [users],
  );

  const [searchUser, setSearchUser] = useState<string>("");
  const [paginaActual, setPaginaActual] = useState(1);

  const filtredUser = useMemo(() => {
    if (!searchUser.trim()) return users;

    const searchLower = searchUser.toLocaleLowerCase();
    return users.filter(
      (user) =>
        user.usuario.toLowerCase().includes(searchLower) ||
        user.nombreCompleto.toLowerCase().includes(searchLower) ||
        user.correo.toLowerCase().includes(searchLower),
    );
  }, [users, searchUser]);

  /* Paginacion */

  const totalPaginas: number = Math.ceil(filtredUser.length / ITEMS_POR_PAGINA);
  const inicio: number = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin: number = inicio + ITEMS_POR_PAGINA;
  const usersPaginados: User[] = filtredUser.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  return (
    <section className="w-full px-4 py-5 md:px-6">
      <HeaderTitleAdmin {...headerAdmin} />

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-[#9adce2]"
            />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              onChange={(event) => setSearchUser(event.target.value)}
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>

          {tienePermiso("Crear usuarios") && (
            <ButtonsComponet
              text="Nuevo Usuario"
              typeButton="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
              icon="fa-solid fa-plus"
              onClick={() => navigate("/Users-Management/Create-User")}
              disabled={false}
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3 mb-6">
        <CardTtoalComponent
          title="Total de Usuarios"
          total={totalUsers}
          colorNumber="text-[#0a4d76]"
        />
        <CardTtoalComponent
          title="Usuarios Activos"
          total={activeUsers}
          colorNumber="text-[#009b3a]"
        />
        <CardTtoalComponent
          title="Usuarios Inactivos"
          total={inactiveUsers}
          colorNumber="text-[#e10000]"
        />
      </div>

      <TableComponent
        tituloTablaInventario={tableHeader}
        contenidoTabla={
          <TableUsersData
            isLoading={isLoading}
            isError={isError}
            error={error}
            users={usersPaginados}
            inactiveUser={inactiveUser.mutate}
            activeUser={activeUser.mutate}
            deleteUserMutation={deleteUserMutation.mutate}
            tienePermiso={tienePermiso}
            navigate={navigate}
          />
        }
      />

      <PaginacionComponent
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={irAPagina}
        inicio={inicio}
        fin={fin}
        registros={filtredUser}
      />
    </section>
  );
}
