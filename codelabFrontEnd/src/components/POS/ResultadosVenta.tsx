import { faBox, faHashtag, faSearch, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Product } from "../../interfaces/POS/IPos";

export default function ResultadosVenta({searchTerm, searchResults, addToCart}: {searchTerm: string, searchResults: Product[], addToCart: (product: Product) => void}) {
    return (
        <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
              {" "}
              {/* Resultados de busqueda */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-[#114c6f]">
                  {searchTerm
                    ? "Resultados de Búsqueda"
                    : "Productos Disponibles"}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {searchTerm === "" ? (
                  <div className="text-center py-12 text-[#4a6eb0]">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-6xl mx-auto mb-4 opacity-50"
                    />
                    <p className="text-lg">
                      Busca productos por nombre, código o categoría
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <FontAwesomeIcon
                      icon={faBox}
                      className="text-6xl mx-auto mb-4 text-gray-400"
                    />
                    <p className="text-lg text-[#4a6eb0] mb-2">
                      No se encontraron resultados
                    </p>
                    <p className="text-sm text-gray-500">
                      Intenta con otro término de búsqueda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          product.stock === 0
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                            : "border-[#9cd2d3] hover:border-[#079f9b] hover:bg-[#079f9b]/5"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-[#114c6f] mb-1">
                              {product.name}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#4a6eb0]">
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faHashtag}
                                  className="text-xs"
                                />
                                {product.code}
                              </span>
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faTag}
                                  className="text-xs"
                                />
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#079f9b]">
                              {new Intl.NumberFormat("es-HN", {
                                style: "currency",
                                currency: "HNL",
                              }).format(product.price)}
                            </div>
                            <div
                              className={`text-xs font-semibold ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"}`}
                            >
                              {product.stock > 0
                                ? `Stock: ${product.stock}`
                                : "Sin stock"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
    )
}