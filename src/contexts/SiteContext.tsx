'use client'
import * as React from "react"
import {toast} from "sonner"
import {useContext} from "react"
import { SiteContextType, SiteSetting } from "@/components/interfaces"

const SiteContext = React.createContext<SiteContextType | undefined>(undefined)

function convertData(data) {
  const convertedData = {};

  data.forEach(item => {
    const { settingName, settingValue } = item;
    convertedData[settingName] = settingValue;
  });

  convertedData.site_language = "vi";
  convertedData.rateConvert = parseInt(convertedData.rateConvert);
  convertedData.limitSize = parseInt(convertedData.limitSize);
  convertedData.limitWeight = parseInt(convertedData.limitWeight);

  return convertedData;
}

export const SiteProvider = ({ children }) => {
    const [siteSetting, setSiteSetting] = React.useState<SiteSetting[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchSiteSetting = async () => {
            try {
                setLoading(true)
                let res = await fetch('/api/general-setting')
                let data = await res.json()
                setSiteSetting(data.data)
            } catch (error) {
                console.log(error)
                toast.error('Something went wrong')
            } finally {
                setLoading(false)
            }
        }
        fetchSiteSetting()
    }, [])

    return (
        <SiteContext.Provider value={{ siteSetting }}>
            {children}
        </SiteContext.Provider>
    )
}

export const useSiteSetting = (): SiteContextType => {
    const context = useContext(SiteContext)
    if (!context) {
      throw new Error('useSiteSetting must be used within a SiteProvider')
    }
    return context
}