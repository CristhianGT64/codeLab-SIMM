import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { bottonEliminar, HeaderPOS } from "../../../data/dataAdministrator/POSData";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import { VentaRegistrada } from "../../../components/POS/VentaRegistrada";
import ConfirmarVentas from "../../../components/POS/ConfirmarVenta";
import CarritoVenta from "../../../components/POS/CarritoVenta";
import TotalSubTotalVenta from "../../../components/POS/TotalSubTotalVenta";
import ResultadosVenta from "../../../components/POS/ResultadosVenta";
import { usePosController } from "./hooks/usePosController";

export function POSMain() {
  const {
    cart,
    completedSale,
    confirmSale,
    searchResults,
    searchTerm,
    setCompletedSale,
    setSearchTerm,
    showConfirmModal,
    setShowConfirmModal,
    totals,
    user,
    permisos,
    addToCart,
    cancelSale,
    completeSale,
    updateQuantity,
    removeFromCart,
  } = usePosController();

  if (completedSale) {
    return (
      <VentaRegistrada
        completedSale={completedSale}
        setCompletedSale={setCompletedSale}
      />
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="max-w-7xl mx-auto h-full">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-linear-to-br from-[#079f9b] to-[#4a6eb0] rounded-2xl">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-2xl text-white"
                />
              </div>
              <HeaderTitleAdmin {...HeaderPOS} />
            </div>
            {cart.length > 0 && (
              <ButtonsComponet {...bottonEliminar} onClick={cancelSale} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4a6eb0]"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, codigo o categoria..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-[#9cd2d3] rounded-xl focus:outline-none focus:border-[#079f9b] transition-colors text-lg"
                  autoFocus
                />
              </div>
            </div>

            <ResultadosVenta
              searchTerm={searchTerm}
              searchResults={searchResults}
              addToCart={addToCart}
            />
          </div>

          <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-linear-to-r from-[#079f9b] to-[#4a6eb0] text-white">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} />
                Carrito ({cart.length})
              </h2>
            </div>

            <CarritoVenta
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />

            <TotalSubTotalVenta
              cart={cart}
              totals={totals}
              completeSale={completeSale}
              permisos={permisos}
            />
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmarVentas
          cart={cart}
          totals={totals}
          confirmSale={confirmSale}
          setShowConfirmModal={setShowConfirmModal}
          user={user}
        />
      )}
    </div>
  );
}
