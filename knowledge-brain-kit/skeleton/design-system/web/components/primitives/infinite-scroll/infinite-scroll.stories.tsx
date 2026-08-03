import type { Meta, StoryObj } from "@storybook/react"
import React from 'react';
import InfiniteScroll from './infinite-scroll';
import { Loader2 } from 'lucide-react';

const meta: Meta<typeof InfiniteScroll> = {
    title: "Primitives/Infinite Scroll",
    component: InfiniteScroll,
    tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof InfiniteScroll>

interface DummyProductResponse {
    products: DummyProduct[];
    total: number;
    skip: number;
    limit: number;
}

interface DummyProduct {
    id: number;
    title: string;
    price: string;
}

const Product = ({ product }: { product: DummyProduct }) => {
    return (
        <div className="flex w-full flex-col gap-2 rounded-lg border-2 border-border p-4 bg-card text-card-foreground">
            <div className="flex gap-2">
                <div className="flex flex-col justify-center gap-1">
                    <div className="font-bold text-primary">
                        {product.id} - {product.title}
                    </div>
                    <div className="text-sm text-muted-foreground">${product.price}</div>
                </div>
            </div>
        </div>
    );
};

export const Demo: Story = {
    render: () => {
        const InfiniteScrollDemo = () => {
            const [page, setPage] = React.useState(0);
            const [loading, setLoading] = React.useState(false);
            const [hasMore, setHasMore] = React.useState(true);
            const [products, setProducts] = React.useState<DummyProduct[]>([]);

            const next = async () => {
                setLoading(true);

                setTimeout(async () => {
                    const res = await fetch(
                        `https://dummyjson.com/products?limit=3&skip=${3 * page}&select=title,price`,
                    );
                    const data = (await res.json()) as DummyProductResponse;
                    setProducts((prev) => [...prev, ...data.products]);
                    setPage((prev) => prev + 1);

                    if (data.products.length < 3) {
                        setHasMore(false);
                    }
                    setLoading(false);
                }, 800);
            };

            return (
                <div className="max-h-[300px] w-full max-w-md mx-auto overflow-y-auto px-4 border rounded-md">
                    <div className="flex w-full flex-col items-center gap-3 pt-4">
                        {products.map((product) => (
                            <Product key={product.id} product={product} />
                        ))}
                        <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin text-muted-foreground" />}
                        </InfiniteScroll>
                        {!hasMore && <div className="py-4 text-sm text-muted-foreground">No more products</div>}
                    </div>
                </div>
            );
        };

        return <InfiniteScrollDemo />;
    }
}
