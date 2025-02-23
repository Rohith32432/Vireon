import { useState, useCallback, useEffect } from 'react';
import useToast from './useToast';

function useAsync() {
  const { promisetoast } = useToast();
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message,setmessage]=useState('')



  const execute = useCallback( (func:  Promise<any>, toast = false) => {
    setLoading(true);
    const asyncCall = func
    .then((result) => {
      setData(result);
      setError(null);
      setmessage(result?.data?.message)
    })
    .catch((err ,reject) => {
      reject(err)
      setError(err);
      setmessage(err?.data)
      setData(null);
    })
    .finally(() => {
      setLoading(false);
    });
    if (toast) {
      promisetoast(asyncCall,message)
    }
    return {data}
  }, [promisetoast,data]);

  return { data, error, loading, execute }; 
}

export default useAsync;
