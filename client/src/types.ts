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
  expires_at: string;
  ClashItem: ClashItem[];
  ClashComment: ClashComment[];
};

type ClashItemTypes = {
  image: File | null;
};

type ClashItem = {
  id: number;
  image: string;
  count: number;
};

type ClashComment = {
  id: number;
  created_at: string;
  comment: number;
};
