export interface tip{
    note:boolean,
    list:boolean
};

export interface uData{
    list:list[],
    notes:note[]
};

export interface eData{
    title: string,
    keyword: string,
    content: string,
    id: number,
    importance: string
};

export interface note{
    title: string,
    keyword: string,
    content: string,
    id: number
};

export interface list{
    title: string,
    content: string,
    importance: string,
    id: number
};
  
  