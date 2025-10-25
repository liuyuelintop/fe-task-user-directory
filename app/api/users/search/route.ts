import { NextRequest } from 'next/server';
import { getMockUsers } from '@/lib/mockUserStore';
import { User } from '@/types';

const DEFAULT_PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  await wait(200); // simulate a realistic latency budget

  const params = parseParams(request);
  const dataset = await getMockUsers();
  const nationalities = extractNationalities(dataset);
  const filtered = filterUsers(dataset, params);

  const start = (params.page - 1) * params.pageSize;
  const pageItems = filtered.slice(start, start + params.pageSize);

  return Response.json({
    data: pageItems,
    meta: {
      total: filtered.length,
      totalAll: dataset.length,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: start + params.pageSize < filtered.length,
      nationalities,
    },
  });
}

function parseParams(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  const nationality = request.nextUrl.searchParams.get('nationality')?.toUpperCase() ?? 'ALL';
  const page = Math.max(Number(request.nextUrl.searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.max(
    Number(request.nextUrl.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
    1,
  );

  return { search, nationality, page, pageSize };
}

function filterUsers(users: User[], params: { search: string; nationality: string }) {
  return users.filter(user => {
    const matchesSearch =
      params.search.length === 0 || user.name.full.toLowerCase().includes(params.search);
    const matchesNationality =
      params.nationality === 'ALL' ||
      user.nationality.toUpperCase() === params.nationality;

    return matchesSearch && matchesNationality;
  });
}

function extractNationalities(users: User[]) {
  return Array.from(new Set(users.map(user => user.nationality))).sort();
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
