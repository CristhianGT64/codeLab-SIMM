import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import { useNavigate } from "react-router";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { HeaderRolesPermission } from "../../../data/dataAdministrator/RolesPermissionData";
import CardPermissionRolesComponent from "../../../components/cardPermissionRoles/CardPermissionRoles";
import useListRols from "../../../hooks/RolesHooks/useListRols";
import useListPermisos from "../../../hooks/PermisosHook/useListPermisos";
import useDeleteRol from "../../../hooks/RolesHooks/useDeleteRol";
import useAuth from "../../../hooks/useAuth";

export default function RolesPermisionManagment() {
  const { data: rolesData } = useListRols();
  const {data : permisosData} = useListPermisos();
  const roles = rolesData?.data ?? [];
  const Permisos = permisosData?.data ?? [];
  const navigate = useNavigate();
  const deleteRolMutation = useDeleteRol();
  const { tienePermiso } = useAuth();
  const [searchRol, setSearchRol] = useState<string>('');

  const rolesFiltred = roles.filter((rol) => rol.disponible === true)

  const {totalRoles, totalRolesSistema, totalPermisos} = useMemo(
    () => ({
      totalRoles: roles.length,
      totalRolesSistema : roles.filter((rol) => rol.nombre.toLowerCase() === 'administrador').length,
      totalPermisos : Permisos.length,
    }),
    [roles],
  );

  const filtredRol = useMemo(() => {
    if (!searchRol.trim()) return rolesFiltred;

    const searchLower = searchRol.toLocaleLowerCase();
    return rolesFiltred.filter((rol) => rol.nombre.toLocaleLowerCase().includes(searchLower))
  }, [searchRol, rolesFiltred])

  const handleDeleteRole = async (id : string) => {
     deleteRolMutation.mutate(id);
  }

  return (
    <section className="w-full px-4 py-5 md:px-6">
      <HeaderTitleAdmin {...HeaderRolesPermission} />

      {/* Barra de búsqueda y botones */}
      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-96">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-[#9adce2]"
            />
            <input
              onChange={(event) => setSearchRol(event.target.value)}
              type="text"
              placeholder="Buscar roles..."
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>

          <div className="flex gap-3">
            {tienePermiso("Crear permisos") && (
              <ButtonsComponet
                text="Agregar Permisos"
                typeButton="button"
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#0aa6a2] bg-white px-5 text-base font-semibold text-[#0aa6a2] hover:bg-[#e8f8f7] md:text-lg"
                icon="fa-solid fa-key"
                onClick={() =>
                  navigate("/RolesPermision-Management/Create-Permisssion")
                }
                disabled={false}
              />
            )}
            {tienePermiso("Crear roles") && (
              <ButtonsComponet
                text="Nuevo Rol"
                typeButton="button"
                className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
                icon="fa-solid fa-plus"
                onClick={() =>
                  navigate("/RolesPermision-Management/Create-Roles")
                }
                disabled={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <CardTotalComponent
          title="Total de Roles"
          total={totalRoles}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Roles del Sistema"
          total={totalRolesSistema}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Permisos Disponibles"
          total={totalPermisos}
          colorNumber="text-[#0a4d76]"
        />
      </div>

      {/* Grid de tarjetas de roles */}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtredRol.map((rol) => (
          <CardPermissionRolesComponent
            key={`${rol.id}-${rol.nombre}`}
            id={String(rol.id)}
            name={rol.nombre}
            subTitle={""}
            description={rol.descripcion}
            totalPermissionAssigned={rol.totalPermisosRol}
            totalUserRol={rol.totalUsuariosRol}
            onDelete={handleDeleteRole}
          />
        ))}
      </div>
    </section>
  );
}
