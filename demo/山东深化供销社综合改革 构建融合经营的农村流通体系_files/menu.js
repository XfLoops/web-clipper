navHover1 = function()
					{ 
                                                return;
						var lis = document.getElementById("menu").getElementsByTagName("td"); 
						for (var i=0; i<lis.length; i++) 
						{ 
							lis[i].onmouseover=function() 
								{
									setMenuShow(this); 
								} 
								lis[i].onmouseout=function() 
								{ 
									setMenuHidden(this);
								}
						} 
					} 
					function setMenuShow(obj)
					{
					        return;
						var objCdnDiv=obj.getElementsByTagName("div");
						
						if(objCdnDiv.length>0)
						{
							objCdnDiv[1].className="divmenushow";
							//objCdnDiv[1].style.left=obj.screenLeft;
							
							//alert(obj.scrollLeft);
							//alert(document.documentElement.scrollLeft);
							//var oRect=obj.getBoundingClientRect();   
    						//var x=oRect.left  
							//alert(x+","+document.body.scrollWidth);
							//td���
							var objWidth=obj.scrollWidth;
							//div���
							var CdDivWidth=objCdnDiv[1].scrollWidth;
							//����������
							var sL=document.documentElement.scrollLeft;
							//��ǰtd�������
							var oRect=obj.getBoundingClientRect();   
    						var x=oRect.left;
							
							//���������߾���
							var frmLeft=(sL+x)-((CdDivWidth-objWidth)/2);
							
							//�ж�����Ƿ�������������
							if(frmLeft-sL<0)
							{
								frmLeft=sL;
							}
							//alert(document.documentElement.scrollLeft);
							//alert(document.documentElement.clientWidth);
							//�ж��ұ��Ƿ�������������
							//var pageW=document.documentElement.scrollWidth;//ҳ����
							var pageW=document.documentElement.clientWidth;//ҳ��ɼ����
							if((frmLeft+CdDivWidth)>(pageW+sL))
							{
								frmLeft=(pageW+sL)-CdDivWidth;
							}
							
							objCdnDiv[1].style.left=frmLeft+"px";
							//alert(obj.scrollWidth);
							/*var displaydiv=objCdnDiv[1].getElementsByTagName("div");
							if(displaydiv.length>0)
							{
								//��ȡ�˵�����
								var len=displaydiv[0].scrollWidth ;
								//alert(len);
							}*/
							var disHeadDiv=objCdnDiv[1].getElementsByTagName("div");
							if(disHeadDiv.length>0)
							{
								var imgs=disHeadDiv[0].getElementsByTagName("img");
								/*if(imgs.length>0)
								{
									alert(imgs[0].src);
								}*/
							}
						}
					}
					function setMenuHidden(obj)
					{
                                                return;
						var objCdnDiv=obj.getElementsByTagName("div");
						if(objCdnDiv.length>0)
						{
							objCdnDiv[1].className="divmenuhidden";
						}
					}
					
					
					navHover1();