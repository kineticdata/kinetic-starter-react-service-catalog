import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchCategories, defineKqlQuery, searchSubmissions } from '@kineticdata/react';
import { GlobalContext } from '../Global/GlobalResources/GlobalContextWrapper';

export const ServicePortalContext = createContext({});

export function ServicePortalContextWrapper({children}) {
  const globalState = useContext(GlobalContext);
  const { userProfile } = globalState;
  const { username } = userProfile || {};
  const [ categories, setCategories ] = useState([]);
  const [ categoryError, setCategoryError ] = useState();
  const [ draftCount, setDraftCount ] = useState();
  const [ submittedCount, setSubmittedCount ] = useState();
  const [ closedCount, setClosedCount ] = useState();
  const [ searchText,  setSearchText ] = useState('');

  const query = defineKqlQuery()
  .in('type', 'type')
  .in('coreState', 'coreState')
  .or()
  .equals('createdBy', 'username')
  .equals('submittedBy', 'username')
  .equals('values[Requested By]', 'username')
  .equals('values[Requested For]', 'username')
  .end()
  .end();

  useEffect(() => {
    if (username) {
      const q = query({
        type: ['Catalog Item'],
        coreState: ['Draft'],
        username,
      });
  
      searchSubmissions({
        kapp: 'catalog',
        search: {
          count: true,
          limit: 0,
          include: [],
          q,
        },
      }).then(
        result => result.error ? setDraftCount('N/A') : setDraftCount(result.count));
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      const q = query({
        type: ['Catalog Item'],
        coreState: ['Submitted'],
        username,
      });
  
      searchSubmissions({
        kapp: 'catalog',
        search: {
          count: true,
          limit: 0,
          include: [],
          q,
        },
      }).then(
        result => result.error ? setSubmittedCount('N/A') : setSubmittedCount(result.count));
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      const q = query({
        type: ['Catalog Item'],
        coreState: ['Closed'],
        username,
      });
  
      searchSubmissions({
        kapp: 'catalog',
        search: {
          count: true,
          limit: 0,
          include: [],
          q,
        },
      }).then(
        result => result.error ? setClosedCount('N/A') : setClosedCount(result.count));
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchCategories({ kappSlug: 'catalog', include: 'attributesMap' }).then(({ categories, error }) => {
        if (!error) {
            // Do not include hidden categories
            setCategories(categories.filter(cat => cat.attributesMap['Hidden'][0]?.toLowerCase() !== 'true'));
          } else {
            setCategoryError(error)
          }
      });
    }
  }, [username]);
    
  const ServicePortalData = useMemo(() => ({
      categories,
      searchText,
      categoryError,
      draftCount,
      submittedCount,
      closedCount,
      setCategories,
      setSearchText,
  }), [
    categories, 
    categoryError,
    draftCount,
    submittedCount,
    closedCount,
    searchText,
  ]);
  
  return (
      <ServicePortalContext.Provider value={ServicePortalData}>
          {children}
      </ServicePortalContext.Provider>
  );
}
