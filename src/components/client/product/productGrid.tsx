import Link from "next/link";

type Product = { 
    id: number; 
    name: string; 
    price: number; 
    imageSrc: string; 
    imageAlt: string; 
    slug: string;  
    description: string; 
  };
  

export const ProductGrid = ({ products }: { products: Product[] }) => {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl  py-16  sm:py-20 lg:max-w-7xl ">
  
          <div className=" grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.name}>
                <div className="relative">
                  <div className="relative h-72 w-full overflow-hidden rounded-lg">
                    <img
                      alt={product.name}
                      src={'https://via.placeholder.com/300x300'} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="relative mt-4">
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  </div>
                  <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                    />
                    <p className="relative text-lg font-semibold text-white">{product.price}€</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                  >
                    Voir le produit<span className="sr-only">, {product.name}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  