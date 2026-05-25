"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;

  inventories: {
    id: string;
    totalStock: number;
    reservedStock: number;

    warehouse: {
      name: string;
    };
  }[];
};

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products
  async function fetchProducts() {

    const response = await fetch(
      "http://localhost:3000/api/products"
    );

    const data = await response.json();

    setProducts(data);
  }

  // Reserve inventory
  async function reserveItem(inventoryId: string) {

    const response = await fetch(
      "http://localhost:3000/api/reservations",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          inventoryId,
          quantity: 1,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    // Refresh products after reservation
    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1>Inventory System</h1>

      {products.map((product) => (

        <div
          key={product.id}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
          }}
        >

          <h2>{product.name}</h2>

          {product.inventories.map((inventory) => {

            const availableStock =
              inventory.totalStock -
              inventory.reservedStock;

            return (

              <div key={inventory.id}>

                <p>
                  Warehouse:
                  {" "}
                  {inventory.warehouse.name}
                </p>

                <p>
                  Total Stock:
                  {" "}
                  {inventory.totalStock}
                </p>

                <p>
                  Reserved Stock:
                  {" "}
                  {inventory.reservedStock}
                </p>

                <p>
                  Available Stock:
                  {" "}
                  {availableStock}
                </p>

                <button
                  onClick={() =>
                    reserveItem(inventory.id)
                  }
                >
                  Reserve 1 Item
                </button>

              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}