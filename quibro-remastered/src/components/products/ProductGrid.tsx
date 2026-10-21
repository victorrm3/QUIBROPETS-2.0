"use client";

import { useRef } from "react";
import { ProductCard, type Product } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  showPrice: boolean;
};

const DRAG_THRESHOLD = 8;

export function ProductGrid({ products, showPrice }: ProductGridProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    pointerDown: false,
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragState.current = {
      pointerDown: true,
      isDragging: false,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || !dragState.current.pointerDown) return;

    const deltaX = event.clientX - dragState.current.startX;

    if (!dragState.current.isDragging) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;

      dragState.current.isDragging = true;
      dragState.current.moved = true;
      scroller.setPointerCapture(event.pointerId);
      scroller.classList.add("cursor-grabbing");
    }

    scroller.scrollLeft = dragState.current.scrollLeft - deltaX;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    dragState.current.pointerDown = false;
    dragState.current.isDragging = false;
    scroller.classList.remove("cursor-grabbing");
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragState.current.moved = false;
    }
  };

  if (products.length === 0) {
    return (
      <section className="w-full bg-black px-6 py-10 text-sm text-zinc-500">
        No hay productos disponibles todavía.
      </section>
    );
  }

  return (
    <section className="w-full bg-black py-4">
      <div
        ref={scrollerRef}
        className="flex cursor-grab gap-2 overflow-x-auto px-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onClickCapture={handleClickCapture}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showPrice={showPrice}
          />
        ))}
      </div>
    </section>
  );
}
