import { SearchService } from './search.service';

describe('SearchService', () => {
  it('adds signed page icon URLs to public share search results', async () => {
    const result = {
      id: 'page-id',
      slugId: 'page-slug',
      title: 'Page',
      icon: 'page-icon:0198cfe2-5b13-74b4-a1fb-4935d06d48bc',
      highlight: 'match',
    };
    const enrichedResult = { ...result, iconUrl: '/api/files/public/icon' };
    const query: Record<string, jest.Mock> = {};
    for (const method of [
      'select',
      'where',
      '$if',
      'orderBy',
      'limit',
      'offset',
    ]) {
      query[method] = jest.fn(() => query);
    }
    query.execute = jest.fn().mockResolvedValue([result]);

    const db = { selectFrom: jest.fn(() => query) };
    const pageRepo = {
      getPageAndDescendantsExcludingRestricted: jest
        .fn()
        .mockResolvedValue([{ id: result.id }]),
    };
    const shareRepo = {
      findById: jest.fn().mockResolvedValue({
        id: 'share-id',
        pageId: result.id,
        workspaceId: 'workspace-id',
        includeSubPages: true,
      }),
    };
    const pagePermissionRepo = {
      hasRestrictedAncestor: jest.fn().mockResolvedValue(false),
    };
    const shareService = {
      addPublicPageIconUrls: jest.fn().mockResolvedValue([enrichedResult]),
    };

    const service = new SearchService(
      db as any,
      pageRepo as any,
      shareRepo as any,
      {} as any,
      pagePermissionRepo as any,
      shareService as any,
    );

    await expect(
      service.searchPage({ query: 'match', shareId: 'share-id' } as any, {
        workspaceId: 'workspace-id',
      }),
    ).resolves.toEqual({ items: [enrichedResult] });
    expect(shareService.addPublicPageIconUrls).toHaveBeenCalledWith(
      [result],
      'workspace-id',
    );
  });
});
