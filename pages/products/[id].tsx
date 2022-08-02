import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumb } from '../../app/components/ui/breadcrumb/Breadcrumb';

import { capitalizeFirstLetter } from '@/utils/string/capitalizeFirstLetter';
import { AppRouteKeys, AppRoutesEnum } from '@/shared/models/routes';
import { setCurrency } from '@/utils/string/setCurrency';
import { IProduct } from '@/shared/models/product';
import { API_URL } from '@/shared/constants';
import Meta from '@/components/shared/meta';
import Heading from '@/ui/heading';

export const getStaticPaths = async () => {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();

  const paths = data.map(({ id }: { id: number }) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async (context: { params: IProduct }) => {
  const { id } = context.params;
  let data = [];
  let error = '';

  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    data = await response.json();
  } catch (e: any) {
    error = e.toString();
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { product: data, error, fallback: 'blocking' },
  };
};

interface IProductProps {
  product: IProduct;
  error: string;
}

const Product: FC<IProductProps> = ({ product, error }) => {
  if (error) {
    return <div className="p-5">404</div>;
  }

  return (
    <>
      <Meta title={product.title}>
        <div className="max-w-6xl p-5">
          <div className="pl-1 mb-5">
            <Breadcrumb
              startPath={{ title: AppRouteKeys.HOME, href: AppRoutesEnum.HOME }}
              paths={[
                {
                  title: AppRouteKeys.PRODUCTS,
                  href: AppRoutesEnum.PRODUCTS,
                },
              ]}
              endPath={`${product.title}`}
            />
          </div>
          <div className="max-w-full flex flex-row pt-4 bg-white rounded-lg border border-gray-200 shadow-md ">
            <div className="max-w-xl w-full p-5">
              <Image
                src={product.image}
                alt={product.title}
                quality={100}
                width={500}
                height={500}
                objectFit="contain"
                layout="responsive"
              />
            </div>
            <div className="max-w-xl p-5">
              <Heading tag="h2" text={product.title} classes="mb-2 text-xl font-bold tracking-tight text-gray-900" />
              <p className="mb-3 font-normal text-gray-700 text-sm">{product.description}</p>
              <div className="text-left border-t-2 pt-2">
                <p className="mb-2 text-gray-700">
                  Category:{' '}
                  <Link href={`#${product.category}`}>
                    <span className="font-bold cursor-pointer">{capitalizeFirstLetter(product.category)}</span>
                  </Link>
                </p>
                <p className="mb-2 text-gray-700">
                  Price: <span className="font-bold">{setCurrency(product.price)}</span>
                </p>
                <p className="text-gray-700 mb-0">
                  Rating:{' '}
                  <span className="font-bold">
                    {product.rating.rate} / {product.rating.count}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Meta>
    </>
  );
};

export default Product;
