import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router";
import type { FormUserState } from "../../../interfaces/Users/FormUserInterface";
import useListSucursales from "../../../hooks/SucursalesHooks/useListSucursales";
import useListRols from "../../../hooks/RolesHooks/useListRols";
import useCreateUser from "../../../hooks/UsersHooks/useCreateUser";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import useUpdateUser from "../../../hooks/UsersHooks/useUpdateUser";
import useUserById from "../../../hooks/UsersHooks/useUserById";

const initialForm: FormUserState = {
  nombreCompleto: "",
  correo: "",
  usuario: "",
  password: "",
  rolId: "",
  sucursalId: "",
};

export default function FormUser() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormUserState>(initialForm);
  const { data: sucursalesData } = useListSucursales();
  const sucursales = sucursalesData?.data ?? [];
  const { data: rolesData } = useListRols();
  const roles = rolesData?.data ?? [];
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useUserById(id ?? "");
  const { mutateAsync: createUserMutation, isPending: isCreating, error: createError } = useCreateUser();
  const { mutateAsync: updateUserMutation, isPending: isUpdating, error: updateError } = useUpdateUser();
  const isPending = isCreating || isUpdating;
  const mutationError = createError ?? updateError;

  useEffect(() => {
    if (!isEditMode) {
      setForm(initialForm);
      return;
    }

    if (userData?.data) {
      setForm({
        nombreCompleto: userData.data.nombreCompleto,
        correo: userData.data.correo,
        usuario: userData.data.usuario,
        password: "",
        rolId: userData.data.rol.id,
        sucursalId: userData.data.sucursal.id,
      });
    }
  }, [isEditMode, userData]);

  const goBack = () => {
    navigate("/Users-Management");
  };

  const onChangeField =
    (field: keyof FormUserState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const wasProcessed = isEditMode && id
        ? await updateUserMutation({ id, credentials: form })
        : await createUserMutation(form);

      if (wasProcessed) {
        navigate("/Users-Management");
      }
    } catch {}
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <header className="mt-6">
          <h2 className="text-4xl font-bold text-[#0a4d76]">{isEditMode ? "Actualizar Usuario" : "Nuevo Usuario"}</h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            {isEditMode
              ? "Modifica la información del usuario seleccionado"
              : "Completa el formulario para crear un nuevo usuario"}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre Completo <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="nombreCompleto"
                aria-label="Nombre Completo"
                type="text"
                value={form.nombreCompleto}
                onChange={onChangeField("nombreCompleto")}
                placeholder="Ej: Juan Pérez"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Correo Electrónico <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="correo"
                aria-label="Correo Electrónico"
                type="email"
                value={form.correo}
                onChange={onChangeField("correo")}
                placeholder="correo@example.com"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre de Usuario <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="usuario"
                aria-label="Nombre de Usuario"
                type="text"
                value={form.usuario}
                onChange={onChangeField("usuario")}
                placeholder="usuario123"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Contraseña <span className="text-[#ff4f4f]">*</span>
              </p>
              <div className="relative">
                <input
                  id="password"
                  aria-label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={onChangeField("password")}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 pr-26 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 inline-flex -translate-y-1/2 cursor-pointer items-center gap-2 text-lg font-semibold text-[#4661b0] hover:text-[#2c478e]"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  <span>{showPassword ? "Ocultar" : "Mostrar"}</span>
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Rol <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="rol"
                aria-label="Rol"
                value={form.rolId}
                onChange={onChangeField("rolId")}
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
              >
                <option value="">Seleccionar un rol</option>
                {roles.length > 0 ? (
                  roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.descripcion}
                    </option>
                  ))
                ) : (
                  <></>
                )}
              </select>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Sucursal Asignada <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="sucursal"
                aria-label="Sucursal Asignada"
                value={form.sucursalId}
                onChange={onChangeField("sucursalId")}
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-xl border-l-4 border-[#0aa6a2] bg-[#e8f3f5] p-5">
            <h3 className="text-3xl font-bold text-[#0a4d76]">
              Información importante
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-xl text-[#4661b0]">
              <li>
                El correo electrónico y el usuario deben ser únicos en el
                sistema
              </li>
              <li>La contraseña debe tener al menos 6 caracteres</li>
              <li>Los usuarios inactivos no podrán iniciar sesión</li>
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={goBack}
              disabled={isPending}
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              text="Cancelar"
              icon="fa-solid fa-arrow-left"
            />

            {isEditMode ? (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => null}
                disabled={isPending}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Actualizando..." : "Actualizar Usuario"}
                icon="fa-solid fa-floppy-disk"
              />
            ) : (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => null}
                disabled={isPending}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Creando..." : "Crear Usuario"}
                icon="fa-solid fa-floppy-disk"
              />
            )}
          </div>

          {isEditMode && isLoadingUser && (
            <p className="mt-4 text-base font-semibold text-[#4661b0]">
              Cargando información del usuario...
            </p>
          )}

          {isEditMode && isUserError && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">
              {userError instanceof Error ? userError.message : "No se pudo cargar el usuario"}
            </p>
          )}

          {mutationError && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">
              {mutationError.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
