import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Steps from "@/components/Steps"
import { ReactNode } from "react"

const layout = ({children}:{children:ReactNode}) => {
  return (
    <MaxWidthWrapper className=" flex flex-col flex-1">
        <Steps/>
        {children}
    </MaxWidthWrapper>
  )
}

export default layout