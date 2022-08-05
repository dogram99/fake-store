import React from 'react';

import { api } from '@/api/fetch';
import { IUser } from '@/shared/types/user.types';
import { API_URL } from '@/configs/constants';
import SingleUser from '@/components/screens/single-user';
import { NextPageAuth } from '@/shared/types/auth.types';

export const getStaticPaths = async () => {
  const response = await api({ url: `${API_URL}/users`, method: 'GET' });
  const { data } = response;

  const paths = data.map(({ id }: { id: number }) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: { params: IUser }) => {
  const { id } = context.params;
  const response = await api({ url: `${API_URL}/users/${id}`, method: 'GET' });
  const { data } = response;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user: data, fallback: 'blocking' },
  };
};

interface IUserProps {
  user: IUser;
}

const UserPage: NextPageAuth | any = ({ user }: IUserProps) => {
  return <SingleUser user={user} />;
};

UserPage.isOnlyAdmin = true;

export default UserPage;
