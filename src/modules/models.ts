export interface Calc {
  inp_dist?: number;
  inp_mass?: number;
  inp_texp?: number;
  res_en?: number;
  res_ni?: number;
  scope_id?: number;
  star_id?: number;
}

export interface Star {
  constellation?: string;
  creation_date?: string;
  finish_date?: string;
  form_date?: string;
  id?: number;
  mod_id?: number;
  name?: string;
  status?: string;
  user_id?: number;
}

export interface Scope {
  id: number;
  name: string;
  description: string;
  status: boolean;
  img_link: string;
  filter: string;
  lambda: number;
  delta_lamb: number;
  zero_point: number;
}

export interface ScopeWithCalc {
  scope: Scope;
  calc?: Calc;
  count?: number;
}