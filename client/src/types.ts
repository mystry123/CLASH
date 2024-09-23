type ClashFormTypes = {
  title?: string;
  description?: string;
};
type ClashFormTypesError = {
  title?: string;
  description?: string;
  expire_at?: string;
  image?: string;
};

type ClashTypes = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  expire_at: string;
};
