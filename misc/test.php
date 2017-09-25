<?
header('Content-type: text/html; charset=UTF-8');

function declensor($word, $enc = 'UTF-8')
{
    $ret = array_fill(0,7,$word);
    
    $cont = file_get_contents('http://export.yandex.ru/inflect.xml?name='.rawurlencode($word));
    if($cont)
    {
        $cont = explode('<inflection case="', $cont);
        array_shift($cont);
        
        foreach($cont as $v)
        {
            list($num, $name) = explode('">', $v);
            list($name,) = explode('</',$name);
            $ret[$num] = iconv('windows-1251', $enc, $name);
        }
    }
    
    return $ret;
}

$name = isset($_GET['name']) ? $_GET['name'] : '';

echo '<form action="'.$_SERVER['PHP_SELF'].'"><input name="name" value="'.htmlspecialchars($name).'"><input type="submit" value="склонять"></form>';

if($name)
{
    echo '<pre>';
    $res = declensor($name);
    print_r($res);
}
?>