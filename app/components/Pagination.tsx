import { Button } from '@material-ui/core'
import React, { useState ,useMemo}  from 'react'
import { GrPrevious,GrNext } from 'react-icons/gr'
import styled ,{css} from 'styled-components'



const Wrapper  = styled.div`
    text-align:center;    
    a { 
        font-size: 16px;
        width: 40px;
        height: 40px;
        background-color: transparent;
        color: #222;
        border: 1px solid rgba(0,0,0,.05);
        display: inline-block;
        vertical-align: middle;
        line-height: 40px;
        text-decoration: none;
        border-radius: 50%;
        margin: 2px;
        transition: all 0.2s linear;
        text-align:center;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: -moz-none;
        -o-user-select: none;
        user-select: none;
    }
    a:hover{
        background-color:#3498db;
        color:white;
        cursor:pointer;
    }
    .active {
        background-color:#3498db;
        color:white;
    }
`


const Pagination = ({pageCount,onSelect}) => {
    const [selectedIndex,setSelectedIndex] = useState(1)
    const next = () =>{ 
        if(selectedIndex+1 < pageCount){
            setSelectedIndex(selectedIndex+1)
        }
    }
    const prev = () =>{ 
        if(selectedIndex > 1) {
            setSelectedIndex(selectedIndex-1)
        }
    }
    const lastIndex = () =>{
        setSelectedIndex(pageCount)
    }
    const firstIndex  = ()=> {
        setSelectedIndex(1)
    }
    const isActive = (index) => {
        return index === selectedIndex ? "active" : undefined
    }
    const getArrayKeys = (length) => {
        if(selectedIndex === length){
            return Array.from(Array(length+1).keys()).filter(i=>i>selectedIndex-4 && i >0)    
        }
        if(selectedIndex > length-3){
            return Array.from(Array(length+1).keys()).filter(i=>i>selectedIndex-3 &&  i < selectedIndex+3  && i>0)    
        }else{
            return Array.from(Array(length+1).keys()).filter(i=> i<selectedIndex + 3 && i > selectedIndex-3 && i > 0)
        }
    }
    const renderIndex = useMemo(()=>{ 
        onSelect(selectedIndex)
        return getArrayKeys(pageCount)
    },[selectedIndex,pageCount])
    const selectIndex = (index) => {
        setSelectedIndex(index)
    }
    return  ( 
        <Wrapper>
        <div className="pagination m-t-20">
        <a onClick={firstIndex}>«</a>
        <a onClick={prev}>‹</a>
        {renderIndex.map((i,key)=>(
            <a  onClick={()=>selectIndex(i)} className={isActive(i)}>{i}</a>
        ))}
        <a onClick={next}>›</a>
        <a onClick={lastIndex}>»</a>
    </div>
    </Wrapper>
    )
}
export default React.memo(Pagination)