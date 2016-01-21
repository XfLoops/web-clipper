$( document )
	.ready( function () {
		// parent window
		var win = window.parent;
		// global data
		var pageInfo = {
			url: null,
			title: null,
			origin: null,
			html: null,
			text: null
		};
		//
		window.onmessage = function ( e ) {
			if ( e.data.name === 'page' ) {
				pageInfo.url = e.data.url, pageInfo.origin = e.origin, pageInfo.html = e.data.html,
					pageInfo.title = e.data.title, pageInfo.text = e.data.text;
				$( '#page-origin' )
					.html( '来源： <a href="' + pageInfo.url + '" target="_blank">' + pageInfo.origin
						.replace( /http(s)?:\/\//, '' ) + '</a>' );
				//$('#page-title').html('标题： <h2>'+ pageInfo.title +'</h2>');
				$( '#page-content' )
					.html( pageInfo.html );
			}
			if ( e.data.name === 'pdf' ) {
				var html = '<html><body><embed width="100%" height="100%" src="' + e.data.content +
					'" type="application/pdf"></body></html>';
				var win = window.open( '', '_blank' );
				win.document.open( 'text/html', 'replace' );
				win.document.write( html );
				win.document.close();
			}
		};

		// 退出
		$( '#exit' )
			.click( function () {
				$( '#sub-body' )
					.animate( {
						'opacity': 0
					}, '50ms' );
				win.postMessage( 'exit', pageInfo.origin );
			} );
		//默认
		$( '#default-view' )
			.click( function () {
				$( '#page-content' )
					.removeAttr( 'contenteditable' )
					.removeClass( 'editable' );
				var body = $( '#sub-body' );
				body.removeClass()
					.addClass( 'light-color-selected' );
				body.animate( {
					scrollTop: '0px'
				}, '500ms' );

			} );
		// 实验
		$( '#expri-mode' )
			.click( function () {
				var expriBox = $( '#expri-mode-box' );
				var isDisplay = expriBox.css( 'display' );
				if ( isDisplay === 'none' ) {
					expriBox.css( {
						'display': 'block'
					} );
					var resultContent = $( '#page-content' )
						.text();
					var wordsCnt = resultContent.replace( /\s+/g, '' )
						.length;
					if ( resultContent ) {
						pageInfo.text = resultContent;
					}
					$( '#result-count' )
						.text( wordsCnt );
					$( '#correct-count' )
						.text( wordsCnt );
					$( '#result-txt' )
						.val( resultContent );
					$( '#correct-txt' )
						.val( resultContent );
					$( '#container' )
						.css( {
							"display": "none"
						} );
					expriBox.css( {
						"display": "block"
					} );
					$( '#test-url' )
						.attr( {
							"href": pageInfo.url
						} )
						.text( pageInfo.origin );
				} else {
					expriBox.css( {
						'display': 'none'
					} );
					$( '#container' )
						.css( {
							"display": "block"
						} );
				}

			} );
		//监听键盘事件
		$( '.txt-area' )
			.keyup( function () {
				var pasteContent = $( this )
					.val();
				var wordsCnt = pasteContent.replace( /\s+/g, '' )
					.length;
				var id = $( this )
					.attr( 'id' )
					.split( '-' )[ 0 ] + '-count';
				$( '#' + id )
					.text( wordsCnt );
			} );
		// 监听计算按钮
		$( '#calculate' )
			.click( function () {
				var resultCnt = parseInt( $( '#result-count' )
						.text() ),
					correctCnt = parseInt( $( '#correct-count' )
						.text() ),
					pageCnt = parseInt( $( '#page-count' )
						.text() ),
					recall = correctCnt / pageCnt,
					percision = correctCnt / resultCnt,
					f1 = 2 * recall * percision / ( recall + percision );
				$( '#recall' )
					.val( recall );
				$( '#percision' )
					.val( percision );
				$( '#f1-result' )
					.val( f1 );
				console.log( 'recall', recall, 'percision', percision, 'f1', f1 );
				checkResult( recall, percision, f1 );
			} );
		// 再来一遍
		$( '#reset' )
			.click( function () {
				var resultContent = pageInfo.text;
				var wordsCnt = resultContent.replace( /\s+/g, '' )
					.length;
				$( '#result-count' )
					.text( wordsCnt );
				$( '#correct-count' )
					.text( wordsCnt );
				$( '#page-count' )
					.text( 0 );
				$( '#result-txt' )
					.val( resultContent );
				$( '#correct-txt' )
					.val( resultContent );
				$( '#page-txt' )
					.val( '' );
				$( '#recall' )
					.val( '' );
				$( '#percision' )
					.val( '' );
				$( '#f1-result' )
					.val( '' );
			} );
		// 检查计算结果
		function checkResult( recall, percision, f1 ) {
			//convert arguments to array
			var args = [].slice.call( arguments );
			console.log( 'args: ', args );
			// check isNaN or isFinite判断是否为常数
			var result = args.every( function ( num ) {
				return !isNaN( num ) && isFinite( num ) && ( num <= 1 ) && ( num >= 0 );
			} );
			console.log( 'result', result );
			if ( result ) {
				$( '#ok-icon' )
					.animate( {
						"opacity": 1
					}, "200ms" );
				setTimeout( function () {
					$( '#ok-icon' )
						.animate( {
							"opacity": 0
						}, "400ms" );
				}, 1000 );
			} else {
				$( '#error-icon' )
					.animate( {
						"opacity": 1
					}, "200ms" );
				setTimeout( function () {
					$( '#error-icon' )
						.animate( {
							"opacity": 0
						}, "400ms" );
				}, 1000 );
			}

		};

		// 分析
		$( '#analysis-tool' )
			.click( function () {
				var analysisBox = $( '#content-analysis-box' );
				var isDisplay = analysisBox.css( 'display' );
				if ( isDisplay === 'none' ) {
					analysisBox.css( {
						'display': 'block'
					} );
					var resultContent = $( '#page-content' )
						.text();
					if ( resultContent ) {
						pageInfo.text = resultContent;
					}
					$( '#container' )
						.css( {
							"display": "none"
						} );
					$( '#test-url2' )
						.attr( {
							"href": pageInfo.url
						} )
						.text( pageInfo.origin );
					$( '#analysis-cnt' )
						.text( pageInfo.text );
				} else {
					analysisBox.css( {
						'display': 'none'
					} );
					$( '#container' )
						.css( {
							"display": "block"
						} );
				}

			} );
		// 提取关键词
		$( '#extract-keywords' )
			.click( function () {
				var text = $( '#analysis-cnt' )
					.text();
				var msg = {
					type: 'keywords',
					text: text
				};
				win.postMessage( msg, pageInfo.origin );
			} );

		//字体
		// @todo 当点击其他地方式弹出框自动隐藏
		$( '#font-tool' )
			.click( function () {
				$( '#font-dropdown-arrow' )
					.toggleClass( 'visable' );
				$( '#font-tooltip' )
					.toggleClass( 'visable' );
			} );
		// 字体类型
		$( '.font-type' )
			.click( function () {
				$( this )
					.addClass( 'selected' )
					.siblings()
					.removeClass( 'selected' );
				var content = $( '#page-content' );
				if ( $( this )
					.attr( 'id' ) === 'font-type-one' ) {
					if ( content.hasClass( 'bold' ) ) {
						content.removeClass( 'bold' );
					}
					content.addClass( 'light' );
				}
				if ( $( this )
					.attr( 'id' ) === 'font-type-two' ) {
					if ( content.hasClass( 'light' ) ) {
						content.removeClass( 'light' );
					}
					content.addClass( 'bold' );
				}

			} );
		//字体大小
		var fontSizeFlag = 3;
		$( '.font-size' )
			.click( function () {
				var container = $( '#container' );
				if ( $( this )
					.attr( 'id' ) === 'font-shrink' ) {
					if ( fontSizeFlag === 1 ) {
						fontSizeFlag = 1;
					} else {
						--fontSizeFlag;
					}
				}
				if ( $( this )
					.attr( 'id' ) === 'font-amplify' ) {
					if ( fontSizeFlag === 5 ) {
						fontSizeFlag = 5
					} else {
						++fontSizeFlag;
					}
				}
				container.removeClass()
					.addClass( 'font-size' + fontSizeFlag );
			} );
		// 字体颜色
		$( '.font-color' )
			.click( function () {
				$( '.font-color' )
					.each( function () {
						if ( $( this )
							.hasClass( 'selected' ) ) {
							$( this )
								.removeClass( 'selected' );
						}
					} );
				$( this )
					.addClass( 'selected' );
				var body = $( '#sub-body' );
				switch ( $( this )
					.attr( 'id' ) ) {
				case 'color-one':
					body.removeClass()
						.addClass( 'light-color-selected' );
					break;
				case 'color-two':
					body.removeClass()
						.addClass( 'dark-color-selected' );
					break;
				case 'color-three':
					body.removeClass()
						.addClass( 'sepia-color-selected' );
					break;
				}


			} );
		//编辑
		$( '#edit' )
			.click( function () {
				if ( $( '#container' )
					.css( 'display' ) === 'block' ) {
					$( '#page-content' )
						.attr( 'contenteditable', true )
						.addClass( 'editable' );
					$( '#sub-body' )
						.removeClass()
						.addClass( 'dark-color-selected' );
				}
			} );

		// 保存
		$( '#save-to-locale' )
			.click( function () {
				if ( $( this )
					.hasClass( 'clicked' ) ) {
					$( this )
						.removeClass();
					$( '.save-to-locale-box' )
						.removeAttr( 'style' );
					$( '#page-content' )
						.removeAttr( 'contenteditable' )
						.removeClass( 'editable' );
				} else {
					$( this )
						.addClass( 'clicked' );
					$( '.save-to-locale-box' )
						.css( {
							"right": "1em"
						} );
					$( '#page-content' )
						.attr( 'contenteditable', true )
						.addClass( 'editable' );
				}

			} );
		// 下载
		$( '#save-to-locale-btn' )
			.click( function () {
				win.postMessage( 'download', pageInfo.origin );
			} );

		//顶部
		$( '#back-to-top' )
			.click( function () {
				$( '#sub-body' )
					.animate( {
						scrollTop: '0px'
					}, '500ms' );
			} );
	} );
